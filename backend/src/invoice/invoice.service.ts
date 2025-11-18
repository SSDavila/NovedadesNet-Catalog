import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from '../../prisma/prisma.service';
import { Invoice, Prisma } from '@prisma/client';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PdfService } from 'src/pdf/pdf.service';
import { EmailService } from 'src/email/email.service';
import { SriService } from 'src/sri/sri.service';

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
    private emailService: EmailService,
    private sriService: SriService, 
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, sellerId: number) {
    const { customerId, saleNoteId, items, paymentMethod } = createInvoiceDto;

    if (items.length === 0) {
      throw new BadRequestException('La factura debe tener al menos un ítem.');
    }

    const completeInvoice = await this.prisma.$transaction(async (prisma) => {

      const company = await prisma.company.findFirst();
      if (!company) {
        throw new InternalServerErrorException('Datos de la empresa no configurados.');
      }
      const { companyEstablishmentCode: establishmentCode, companyEmissionPointCode: emissionPointCode } = company;

      if (!establishmentCode || !emissionPointCode) {
        throw new InternalServerErrorException('El código de establecimiento y/o punto de emisión no están configurados en la empresa.');
      }

      const customer = await prisma.customer.findUnique({
        where: { customerId },
      });
      if (!customer) {
        throw new NotFoundException(`Cliente con ID ${customerId} no encontrado.`);
      }

      const productIds = items.map((item) => item.productId);
      const products = await prisma.product.findMany({
        where: { productId: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new NotFoundException('Uno o más productos no fueron encontrados.');
      }

      const ivaTariffs = { '0': 0, '2': 12, '3': 14, '4': 15, '5': 5 };
      let invoiceSubtotal = 0;
      let invoiceTax = 0;
      let invoiceDiscountTotal = 0;
      const invoiceItemsData = [];

      for (const item of items) {
        const product = products.find((p) => p.productId === item.productId);
        if (product.productStock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para ${product.productName}. Stock actual: ${product.productStock}`,
          );
        }

        const unitPrice = product.productPrice.toNumber();
        const discount = item.discount || 0;
        const subtotal = (unitPrice * item.quantity) - discount;
        const ivaRate = ivaTariffs[product.productIvaRate] ?? 0;
        const itemTax = subtotal * (ivaRate / 100);

        invoiceSubtotal += subtotal;
        invoiceTax += itemTax;
        invoiceDiscountTotal += discount;

        invoiceItemsData.push({
          productId: item.productId,
          invoiceItemQuantity: item.quantity,
          invoiceItemUnitPrice: unitPrice,
          invoiceItemSubtotal: subtotal,
          invoiceItemDiscount: item.discount || 0,
        });
      }

      const sequence = await prisma.sequenceControl.upsert({
        where: {
          documentType_establishmentCode_emissionPointCode: {
            documentType: 'INVOICE',
            establishmentCode,
            emissionPointCode,
          },
        },
        update: { currentNumber: { increment: 1 } },
        create: {
          documentType: 'INVOICE',
          establishmentCode,
          emissionPointCode,
          currentNumber: 1,
        },
      });

      const invoiceNumber = `${establishmentCode}-${emissionPointCode}-${sequence.currentNumber
        .toString()
        .padStart(9, '0')}`;
      
      const invoiceAccessKey = this.generateAccessKey(
        new Date(), 
        '01', 
        company.sriEmissionType, // Tipo de Emisión (campo faltante)
        company.companyRuc,
        company.sriEnvironment,
        establishmentCode,
        emissionPointCode,
        invoiceNumber.split('-')[2], 
      );

      const invoiceData: Prisma.InvoiceCreateInput = {
        invoiceNumber,
        invoiceAccessKey, 
        invoiceStatus: 'PENDIENTE', 
        invoiceSriResponse: null,
        invoiceSignedXml: null,
        invoiceSriAuthorizationDateTime: null,
        invoiceSriAuthorizationNumber: null,
        invoiceSubtotal: invoiceSubtotal,
        invoiceTax: invoiceTax,
        invoiceDiscountTotal: invoiceDiscountTotal,
        invoiceTotal: invoiceSubtotal + invoiceTax,
        invoicePaymentMethod: paymentMethod,
        customer: {
          connect: { customerId },
        },
        items: {
          create: invoiceItemsData,
        },
        seller: {
          connect: { userId: sellerId },
        },
        ...(saleNoteId && { saleNote: { connect: { saleNoteId } } }),
      };
      
      const invoice = await prisma.invoice.create({
        data: invoiceData,
      });

      const inventoryMovementsData = [];
      for (const item of items) {
        await prisma.product.update({
          where: { productId: item.productId },
          data: { productStock: { decrement: item.quantity } },
        });

        inventoryMovementsData.push({
          productId: item.productId,
          userId: sellerId,
          invoiceId: invoice.invoiceId,
          inventoryMovementType: 'INVOICE_SALE',
          inventoryMovementQuantity: -item.quantity,
          inventoryMovementReason: `Venta en factura #${invoice.invoiceNumber}`,
        });
      }

      await prisma.inventoryMovement.createMany({
        data: inventoryMovementsData,
      });

      if (saleNoteId) {
        await prisma.saleNote.update({
          where: { saleNoteId },
          data: { saleNoteStatus: 'FACTURADA' },
        });
      }

      // Vuelve a consultar la factura con todas sus relaciones para devolver el objeto completo.
      const completeInvoice = await prisma.invoice.findUnique({
        where: { invoiceId: invoice.invoiceId },
        include: {
          customer: true,
          seller: { select: { userName: true } },
        },
      });

      return completeInvoice;
    });

    // Ahora que la transacción ha terminado, la factura existe en la base de datos.
    // Es seguro iniciar el proceso del SRI.
    this.sriService.processElectronicInvoice(completeInvoice.invoiceId)
      .then(() => console.log(`Proceso SRI iniciado para factura ${completeInvoice.invoiceId}`))
      .catch(sriError => console.error(`Error en el proceso SRI para factura ${completeInvoice.invoiceId}:`, sriError));

    return completeInvoice;
  }

  private generateAccessKey(
    issueDate: Date,
    documentType: string, 
    emissionType: string, // '1' Normal
    ruc: string,
    environment: string, 
    establishmentCode: string,
    emissionPointCode: string,
    sequential: string, 
  ): string {
    const datePart = formatDate(issueDate).replace(/\//g, ''); 
    const randomNum = Math.floor(10000000 + Math.random() * 90000000).toString(); 

    let accessKeyWithoutVerifier =
      datePart +
      documentType +
      ruc +
      environment +
      establishmentCode +
      emissionPointCode +
      sequential +
      randomNum +
      emissionType; // Se añade el tipo de emisión

    let sum = 0;
    let multiplier = 2;
    for (let i = accessKeyWithoutVerifier.length - 1; i >= 0; i--) {
      sum += parseInt(accessKeyWithoutVerifier[i], 10) * multiplier;
      multiplier++;
      if (multiplier > 7) {
        multiplier = 2;
      }
    }
    const remainder = sum % 11;
    const verifierDigit = remainder === 0 ? 0 : remainder === 1 ? 1 : 11 - remainder;

    return accessKeyWithoutVerifier + verifierDigit.toString();
  }

  findAll(sellerId: number) {
    return this.prisma.invoice.findMany({
      where: {
        userId: sellerId,
      },
      include: {
        customer: true,
        seller: { select: { userName: true } },
        // Incluimos los items y los detalles del producto para cada factura en la lista.
        items: {
          include: {
            product: {
              select: { productId: true, productName: true },
            },
          },
        },
      },
      orderBy: {
        invoiceCreatedAt: 'desc',
      },
    });
  }

  async findOne(
    id: number,
  ) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { invoiceId: id },
      select: {
        invoiceId: true,
        invoiceNumber: true,
        invoiceAccessKey: true,
        invoiceStatus: true,
        invoiceSubtotal: true,
        invoiceTotal: true,
        invoiceTax: true,
        invoiceDiscountTotal: true,
        invoiceCreatedAt: true,
        invoicePaymentMethod: true,
        invoiceUpdatedAt: true, 
        customerId: true,
        userId: true,
        saleNoteId: true,
        customer: true,
        seller: true,
        items: {
          include: {
            product: {
              select: { productName: true, productSku: true, productIvaRate: true },
            },
          },
        },
        payments: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada.`);
    }
    return invoice;
  }

  async generateInvoicePdf(id: number): Promise<{ pdfBuffer: Buffer, filename: string }> {
    const invoice = await this.findOne(id);
    const company = await this.findCompany();

    if (invoice.invoiceStatus === 'ANULADA') {
      throw new BadRequestException('No se puede generar el PDF de una factura anulada.');
    }

    const pdfBuffer = await this.pdfService.generateInvoicePdf(invoice, company);
    return { pdfBuffer, filename: `factura-${invoice.invoiceNumber}.pdf` };
  }

  async sendInvoiceByEmail(id: number) {
    const invoice = await this.findOne(id);
    const company = await this.findCompany();

    if (invoice.invoiceStatus === 'ANULADA') {
      throw new BadRequestException('No se puede enviar por correo una factura anulada.');
    }
    if (!invoice.customer.customerEmail) {
      throw new BadRequestException('El cliente no tiene una dirección de correo electrónico registrada.');
    }

    const { pdfBuffer } = await this.generateInvoicePdf(id);

    await this.emailService.sendInvoiceEmail(
      invoice.customer.customerEmail,
      `Factura Electrónica ${invoice.invoiceNumber} de ${company.companyName}`,
      `<p>Estimado/a ${invoice.customer.customerName},</p><p>Adjuntamos su factura electrónica N° ${invoice.invoiceNumber}.</p><p>Gracias por su compra.</p>`,
      [
        { filename: `factura-${invoice.invoiceNumber}.pdf`, content: pdfBuffer, contentType: 'application/pdf' },
      ]
    );

    return;
  }

  async cancel(id: number): Promise<Invoice> {
    const invoice = await this.findOne(id);
    if (invoice.invoiceStatus === 'ANULADA') {
      throw new BadRequestException('La factura ya está anulada.');
    }
    return this.update(id, { invoiceStatus: 'ANULADA' }); 
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    await this.findOne(id);

    return this.prisma.invoice.update({
      where: { invoiceId: id },
      data: updateInvoiceDto,
      include: {
        customer: true,
        seller: true,
        items: {
          include: {
            product: {
              select: {
                productName: true,
                productSku: true,
              },
            },
          },
        },
        payments: true,
      },
    });
  }

  async remove(id: number) {

    const invoice = await this.findOne(id);
    if (invoice.invoiceStatus === 'ANULADA') {
      throw new BadRequestException('La factura ya está anulada.');
    }

    return this.prisma.invoice.update({
      where: { invoiceId: id },
      data: { invoiceStatus: 'ANULADA' },
      include: {
        customer: true,
        seller: true,
        items: {
          include: {
            product: {
              select: {
                productName: true,
                productSku: true,
              },
            },
          },
        },
        payments: true,
      },
    });
  }

  async findCompany() {
    const company = await this.prisma.company.findFirst();
    if (!company) {
      throw new InternalServerErrorException('Datos de la empresa no configurados.');
    }
    return company;
  }
}