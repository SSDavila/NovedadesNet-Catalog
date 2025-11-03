import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { randomBytes } from 'crypto';
import * as fs from 'fs';
import * as forge from 'node-forge';
import { create } from 'xmlbuilder2';
import * as PDFDocument from 'pdfkit';
import * as JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

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

  async findOne(id: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { invoiceId: id },
      include: {
        customer: true,
        seller: true,
        items: {
          include: {
            product: {
              select: { productName: true, productSku: true },
            },
          },
        },
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
      data: {
        invoiceStatus: updateInvoiceDto.invoiceStatus,
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
    });
  }

  async authorize(id: number) {
    const invoice = await this.findOne(id);

    if (invoice.invoiceStatus !== 'PENDIENTE') {
      throw new BadRequestException(`La factura no está en estado PENDIENTE.`);
    }
    
    const company = await this.prisma.company.findFirst();
    if (!company) {
      throw new InternalServerErrorException('Datos de la empresa no configurados.');
    }

    const invoiceDate = new Date(invoice.invoiceCreatedAt);
    const formattedDate = `${invoiceDate.getDate().toString().padStart(2, '0')}/${(invoiceDate.getMonth() + 1).toString().padStart(2, '0')}/${invoiceDate.getFullYear()}`;

    const xmlObject = {
      factura: {
        '@id': 'comprobante',
        '@version': '1.1.0',
        infoTributaria: {
          ambiente: 1,
          tipoEmision: 1, 
          razonSocial: company.companyName,
          nombreComercial: company.companyTradeName || company.companyName,
          ruc: company.companyRuc,
          claveAcceso: invoice.invoiceAccessKey,
          codDoc: '01',
          estab: invoice.invoiceNumber.substring(0, 3),
          ptoEmi: invoice.invoiceNumber.substring(4, 7),
          secuencial: invoice.invoiceNumber.substring(8, 17),
          dirMatriz: company.companyAddress,
        },
        infoFactura: {
          fechaEmision: formattedDate,
          dirEstablecimiento: company.companyAddress,
          obligadoContabilidad: 'SI',
          tipoIdentificacionComprador: invoice.customer.customerIdentificationType,
          razonSocialComprador: invoice.customer.customerName,
          identificacionComprador: invoice.customer.customerIdentificationNumber,
          totalSinImpuestos: invoice.invoiceSubtotal.toFixed(2),
          totalDescuento: '0.00',
          totalConImpuestos: {
            totalImpuesto: [
              {
                codigo: '2',
                codigoPorcentaje: '2',
                baseImponible: invoice.invoiceSubtotal.toFixed(2),
                valor: (invoice.invoiceTotal.toNumber() - invoice.invoiceSubtotal.toNumber()).toFixed(2),
              },
            ],
          },
          propina: '0.00',
          importeTotal: invoice.invoiceTotal.toFixed(2),
          moneda: 'DOLAR',
        },
        detalles: {
          detalle: invoice.items.map(item => ({
            codigoPrincipal: item.product.productSku,
            descripcion: item.product.productName,
            cantidad: item.invoiceItemQuantity,
            precioUnitario: item.invoiceItemUnitPrice.toFixed(2),
            descuento: item.invoiceItemDiscount.toFixed(2),
            precioTotalSinImpuesto: item.invoiceItemSubtotal.toFixed(2),
            impuestos: {
              impuesto: {
                codigo: '2',
                codigoPorcentaje: '2',
                tarifa: '12.00',
                baseImponible: item.invoiceItemSubtotal.toFixed(2),
                valor: (item.invoiceItemSubtotal.toNumber() * 0.12).toFixed(2),
              },
            },
          })),
        },
      },
    };

    const xmlString = create(xmlObject).end({ prettyPrint: true });

    const signedXml = await this.signXml(xmlString, company.sriCertificatePath, company.sriCertificatePassword);

    console.log('XML Firmado:', signedXml);

    return this.prisma.invoice.update({
      where: { invoiceId: id },
      data: { invoiceStatus: 'AUTORIZADA' },
    });
  }

  private async signXml(xmlToSign: string, signaturePath: string, signaturePass: string): Promise<string> {
    try {
      const p12Der = fs.readFileSync(signaturePath).toString('binary');
      const p12Asn1 = forge.asn1.fromDer(p12Der);
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, signaturePass);

      const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
      const privateKeyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });

      const certificate = certBags[forge.pki.oids.certBag][0].cert;
      const privateKey = privateKeyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;

      const certDer = forge.pki.certificateToAsn1(certificate);
      const certB64 = forge.util.encode64(forge.asn1.toDer(certDer).getBytes());

      const md = forge.md.sha1.create();
      md.update(xmlToSign, 'utf8');

      const signature = privateKey.sign(md);
      const signatureB64 = forge.util.encode64(signature);

      const signatureXml = create({
        'ds:Signature': {
          '@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
          '@Id': 'Signature666',
          'ds:SignedInfo': {
            'ds:CanonicalizationMethod': { '@Algorithm': 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315' },
            'ds:SignatureMethod': { '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#rsa-sha1' },
            'ds:Reference': {
              '@URI': '#comprobante',
              'ds:Transforms': {
                'ds:Transform': { '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#enveloped-signature' },
              },
              'ds:DigestMethod': { '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#sha1' },
              'ds:DigestValue': forge.util.encode64(md.digest().bytes()),
            },
          },
          'ds:SignatureValue': signatureB64,
          'ds:KeyInfo': {
            'ds:X509Data': {
              'ds:X509Certificate': certB64,
            },
          },
        },
      }).end();

      return xmlToSign.replace('</factura>', `${signatureXml}</factura>`);
    } catch (error) {
      console.error('Error al firmar el XML:', error);
      throw new InternalServerErrorException('Error al firmar el documento. Verifique la contraseña y la ruta de la firma electrónica.');
    }
  }

  async print(id: number) {
    const invoice = await this.findOne(id);
    const company = await this.prisma.company.findFirst();
    if (!company) throw new InternalServerErrorException('Datos de la empresa no configurados.');

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    const boldFont = 'Helvetica-Bold';
    const normalFont = 'Helvetica';

    doc.fontSize(20).text(`Factura N°: ${invoice.invoiceNumber}`, { align: 'right' });
    doc.fontSize(12).text(`Clave de Acceso: ${invoice.invoiceAccessKey}`, { align: 'right' });
    doc.moveDown();

    const canvas = createCanvas(200, 200); 
    JsBarcode(canvas, invoice.invoiceAccessKey, { format: 'CODE128', height: 40, displayValue: false });
    const barcodeDataUrl = canvas.toDataURL();
    doc.image(barcodeDataUrl, { fit: [400, 50], align: 'center' });
    doc.moveDown();

    doc.fontSize(10).text(`Razón Social: ${company.companyName}`);
    doc.text(`RUC: ${company.companyRuc}`);
    doc.text(`Dirección: ${company.companyAddress}`);
    doc.moveDown();
    doc.fontSize(12).text('Datos del Cliente', { underline: true });
    doc.fontSize(10).text(`Razón Social: ${invoice.customer.customerName}`);
    doc.text(`RUC/CI: ${invoice.customer.customerIdentificationNumber}`);
    doc.text(`Fecha Emisión: ${new Date(invoice.invoiceCreatedAt).toLocaleDateString()}`);
    doc.text(`Dirección: ${invoice.customer.customerAddress}`);
    doc.moveDown(2);

    const tableTop = doc.y;
    const itemX = 50;
    const qtyX = 300;
    const priceX = 370;
    const totalX = 440;

    doc.font(boldFont).fontSize(10);
    doc.text('Descripción', itemX, tableTop);
    doc.text('Cantidad', qtyX, tableTop);
    doc.text('P. Unitario', priceX, tableTop);
    doc.text('Total', totalX, tableTop, { align: 'right' });

    doc.font(normalFont);
    let i = 0;
    for (const item of invoice.items) {
      const y = tableTop + 25 + (i * 25);
      doc.fontSize(10).text(item.product.productName, itemX, y);
      doc.text(item.invoiceItemQuantity.toString(), qtyX, y);
      doc.text(`$${Number(item.invoiceItemUnitPrice).toFixed(2)}`, priceX, y);
      doc.text(`$${Number(item.invoiceItemSubtotal).toFixed(2)}`, 0, y, { align: 'right' });
      i++;
    }
    doc.y = tableTop + 25 + (invoice.items.length * 25);
    doc.moveDown(3);

    doc.font(normalFont).fontSize(10).text(`Subtotal: $${Number(invoice.invoiceSubtotal).toFixed(2)}`, { align: 'right' });
    doc.text(`IVA 12%: $${(Number(invoice.invoiceTotal) - Number(invoice.invoiceSubtotal)).toFixed(2)}`, { align: 'right' });
    doc.font(boldFont).fontSize(12).text(`Total: $${Number(invoice.invoiceTotal).toFixed(2)}`, { align: 'right' });

    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.end();
    });
  }
}