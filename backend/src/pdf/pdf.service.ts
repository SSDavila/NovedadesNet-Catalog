import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';
import axios from 'axios';

@Injectable()
export class PdfService {
  async generateInvoicePdf(invoiceData: any, companyData: any): Promise<Buffer> {
    let logoBuffer: Buffer | null = null;
    if (companyData.companyLogoUrl) {
      try {
        const response = await axios.get(companyData.companyLogoUrl, { responseType: 'arraybuffer' });
        logoBuffer = Buffer.from(response.data, 'binary');
      } catch (error) {
        console.error('No se pudo descargar el logo de la empresa:', error.message);
      }
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    this.generateInvoiceHeader(doc, companyData, logoBuffer);
    this.generateCustomerInformation(doc, invoiceData);
    this.generateInvoiceTable(doc, invoiceData);
    this.generateAdditionalInfo(doc, invoiceData);
    this.generateFooter(doc, invoiceData);

    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.end();
    });
  }

  private generateInvoiceHeader(doc: PDFKit.PDFDocument, company: any, logoBuffer: Buffer | null) {
    const primaryColor = '#0D47A1';
    const headerColor = '#FFFFFF';
    const boldFont = 'Helvetica-Bold';
    const normalFont = 'Helvetica';

    doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);
    if (logoBuffer) {
      doc.image(logoBuffer, 50, 25, { width: 80 });
    }
    doc.font(boldFont).fillColor(headerColor).fontSize(20).text(company.companyName, 200, 40, { align: 'right' });
    doc.font(normalFont).fontSize(10).text(`RUC: ${company.companyRuc}`, 200, 65, { align: 'right' });
    doc.text(company.companyAddress, 200, 80, { align: 'right' });
    doc.moveDown(6);
  }

  private generateCustomerInformation(doc: PDFKit.PDFDocument, invoice: any) {
    const textColor = '#333333';
    const boldFont = 'Helvetica-Bold';
    const normalFont = 'Helvetica';
    const invoiceInfoTop = 140;

    doc.fillColor(textColor);
    doc.font(boldFont).fontSize(14).text('FACTURA', 50, invoiceInfoTop);
    doc.font(normalFont).fontSize(10);
    doc.text(`N°: ${invoice.invoiceNumber}`, 50, invoiceInfoTop + 20);
    doc.text(`Fecha de Emisión: ${new Date(invoice.invoiceCreatedAt).toLocaleDateString()}`, 50, invoiceInfoTop + 35);

    const customerInfoTop = invoiceInfoTop;
    doc.font(boldFont).fontSize(14).text('CLIENTE', 300, customerInfoTop);
    doc.font(normalFont).fontSize(10);
    doc.text(invoice.customer.customerName, 300, customerInfoTop + 20);
    doc.text(`RUC/CI: ${invoice.customer.customerIdentificationNumber}`, 300, customerInfoTop + 35);
    doc.text(invoice.customer.customerAddress || 'Sin dirección', 300, customerInfoTop + 50);
    doc.moveDown(4);
  }

  private generateInvoiceTable(doc: PDFKit.PDFDocument, invoice: any) {
    const primaryColor = '#0D47A1';
    const secondaryColor = '#F5F5F5';
    const textColor = '#333333';
    const headerColor = '#FFFFFF';
    const boldFont = 'Helvetica-Bold';
    const normalFont = 'Helvetica';

    const tableTop = doc.y;
    const tableHeaders = ['SKU', 'Descripción', 'Cant.', 'P. Unitario', 'Total'];
    const columnWidths = [80, 220, 50, 80, 80];
    const columnPositions = [50, 130, 350, 400, 480];

    doc.rect(50, tableTop, doc.page.width - 100, 20).fill(primaryColor);
    doc.font(boldFont).fillColor(headerColor).fontSize(10);
    tableHeaders.forEach((header, i) => {
      doc.text(header, columnPositions[i], tableTop + 5, { width: columnWidths[i], align: i > 1 ? 'right' : 'left' });
    });

    doc.font(normalFont).fillColor(textColor);
    let i = 0;
    let currentY = tableTop + 20;
    for (const item of invoice.items) {
      const rowHeight = Math.max(20, doc.heightOfString(item.product.productName, { width: columnWidths[1] }) + 10);
      if (i % 2 === 1) {
        doc.rect(50, currentY, doc.page.width - 100, rowHeight).fill(secondaryColor);
      }
      doc.fontSize(9);
      doc.text(item.product.productSku || 'N/A', columnPositions[0], currentY + 5, { width: columnWidths[0] });
      doc.text(item.product.productName, columnPositions[1], currentY + 5, { width: columnWidths[1] });
      doc.text(item.invoiceItemQuantity.toString(), columnPositions[2], currentY + 5, { width: columnWidths[2], align: 'right' });
      doc.text(`$${Number(item.invoiceItemUnitPrice).toFixed(2)}`, columnPositions[3], currentY + 5, { width: columnWidths[3], align: 'right' });
      doc.text(`$${Number(item.invoiceItemSubtotal).toFixed(2)}`, columnPositions[4], currentY + 5, { width: columnWidths[4], align: 'right' });
      currentY += rowHeight;
      i++;
    }
    doc.y = currentY;

    const totalsY = doc.y + 20;
    const totalsX = 350;
    doc.font(normalFont).fontSize(10);
    doc.text('Subtotal:', totalsX, totalsY, { align: 'right', width: 100 });
    doc.text(`$${Number(invoice.invoiceSubtotal).toFixed(2)}`, totalsX + 110, totalsY, { align: 'right' });
    doc.text('IVA (12%):', totalsX, totalsY + 15, { align: 'right', width: 100 });
    doc.text(`$${(Number(invoice.invoiceTotal) - Number(invoice.invoiceSubtotal)).toFixed(2)}`, totalsX + 110, totalsY + 15, { align: 'right' });
    doc.font(boldFont).fontSize(12);
    doc.text('TOTAL:', totalsX, totalsY + 30, { align: 'right', width: 100 });
    doc.text(`$${Number(invoice.invoiceTotal).toFixed(2)}`, totalsX + 110, totalsY + 30, { align: 'right' });
  }

  private generateAdditionalInfo(doc: PDFKit.PDFDocument, invoice: any) {
    if (!invoice.payments || invoice.payments.length === 0) {
      return;
    }

    doc.moveDown(2);
    const infoTop = doc.y;
    const textColor = '#333333';
    const boldFont = 'Helvetica-Bold';
    const normalFont = 'Helvetica';

    doc.font(boldFont).fillColor(textColor).fontSize(10).text('Información Adicional', 50, infoTop);
    doc.rect(50, infoTop + 15, doc.page.width - 100, 40).fill('#F5F5F5');

    doc.font(normalFont).fontSize(9);
    let paymentText = 'Forma de Pago: ';
    invoice.payments.forEach((p, index) => {
      paymentText += `${p.paymentMethod} ($${Number(p.paymentAmount).toFixed(2)})${index < invoice.payments.length - 1 ? ', ' : ''}`;
    });
    doc.text(paymentText, 60, infoTop + 22);
  }

  private generateFooter(doc: PDFKit.PDFDocument, invoice: any) {
    const secondaryColor = '#F5F5F5';
    const textColor = '#333333';
    const normalFont = 'Helvetica';
    const pageHeight = doc.page.height;

    doc.rect(0, pageHeight - 100, doc.page.width, 100).fill(secondaryColor);
    try {
      const canvas = createCanvas(200, 200);
      JsBarcode(canvas, invoice.invoiceAccessKey, { format: 'CODE128', height: 40, displayValue: false, margin: 0 });
      const barcodeDataUrl = canvas.toDataURL();
      doc.image(barcodeDataUrl, 50, pageHeight - 80, { fit: [250, 40] });
    } catch (e) {
      console.error("Error al generar el código de barras:", e);
      doc.text('Error al generar código de barras', 50, pageHeight - 80);
    }

    doc.font(normalFont).fontSize(8).fillColor(textColor);
    doc.text('Clave de Acceso:', 50, pageHeight - 35);
    doc.text(invoice.invoiceAccessKey, 50, pageHeight - 25, { width: 250 });
    doc.text('Número de Autorización:', 320, pageHeight - 35);
    doc.text(invoice.invoiceSriAuthorization || invoice.invoiceAccessKey, 320, pageHeight - 25, { width: 250 });
  }
}