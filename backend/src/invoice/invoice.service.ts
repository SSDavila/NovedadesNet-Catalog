import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { randomBytes } from 'crypto';
import { SriService } from 'src/sri/sri.service';
import { PdfService } from 'src/pdf/pdf.service';

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private sriService: SriService,
    private pdfService: PdfService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, sellerId: number) {
    const { customerId, saleNoteId, items } = createInvoiceDto;

    if (items.length === 0) {
      throw new BadRequestException('La factura debe tener al menos un ítem.');
    }

    return this.prisma.$transaction(async (prisma) => {

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

      let invoiceSubtotal = 0;
      const invoiceItemsData = [];

      for (const item of items) {
        const product = products.find((p) => p.productId === item.productId);
        if (product.productStock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para ${product.productName}. Stock actual: ${product.productStock}`,
          );
        }

        const unitPrice = product.productPrice.toNumber();
        const subtotal = unitPrice * item.quantity;
        invoiceSubtotal += subtotal;

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
            establishmentCode: '001',
            emissionPointCode: '001',
          },
        },
        update: { currentNumber: { increment: 1 } },
        create: {
          documentType: 'INVOICE',
          establishmentCode: '001',
          emissionPointCode: '001',
          currentNumber: 1,
        },
      });

      const invoiceNumber = `001-001-${sequence.currentNumber
        .toString()
        .padStart(9, '0')}`;
      const accessKey = randomBytes(24).toString('hex') + '1'; 

      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          invoiceAccessKey: accessKey,
          invoiceSubtotal,
          invoiceTotal: invoiceSubtotal,
          customerId,
          sellerId,
          saleNoteId,
          items: {
            create: invoiceItemsData,
          },
        },
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

      return invoice;
    });
  }

  findAll() {
    return this.prisma.invoice.findMany({
      include: {
        customer: { select: { customerName: true } },
        seller: { select: { userName: true } },
      },
      orderBy: {
        invoiceCreatedAt: 'desc',
      },
    });
  }

  async findOne(
    id: number,
  ): Promise<
    Prisma.InvoiceGetPayload<{
      select: {
        invoiceId: true;
        invoiceNumber: true;
        invoiceAccessKey: true;
        invoiceStatus: true;
        invoiceSubtotal: true;
        invoiceTotal: true;
        invoiceSriAuthorization: true;
        invoiceSriResponse: true;
        invoiceSignedXml: true;
        invoiceCreatedAt: true;
        customer: true;
        seller: true;
        items: {
          include: {
            product: {
              select: { productName: true; productSku: true };
            };
          };
        };
        payments: true;
      };
    }>
  > {
    const invoice = await this.prisma.invoice.findUnique({
      where: { invoiceId: id },
      select: {
        invoiceId: true,
        invoiceNumber: true,
        invoiceAccessKey: true,
        invoiceStatus: true,
        invoiceSubtotal: true,
        invoiceTotal: true,
        invoiceSriAuthorization: true,
        invoiceSriResponse: true,
        invoiceSignedXml: true,
        invoiceCreatedAt: true,
        customer: true,
        seller: true,
        items: {
          include: {
            product: {
              select: { productName: true, productSku: true },
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