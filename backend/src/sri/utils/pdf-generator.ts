import * as PDFDocument from 'pdfkit';
import { format } from 'date-fns';

export const generateRidePdf = (invoice: any, company: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    if (company.companyLogoUrl) {
    //In case of...
    }

    doc
      .fontSize(20)
      .text('R.U.C.: ' + company.companyRuc, 300, 50)
      .fontSize(14)
      .text('FACTURA', 300, 80)
      .fontSize(10)
      .text('No. ' + invoice.invoiceNumber, 300, 100)
      .text('NÚMERO DE AUTORIZACIÓN', 300, 120)
      .text(invoice.invoiceSriAuthorizationNumber || 'PENDIENTE', 300, 135)
      .text('FECHA Y HORA DE AUTORIZACIÓN', 300, 155)
      .text(invoice.invoiceSriAuthorizationDateTime ? format(invoice.invoiceSriAuthorizationDateTime, 'dd/MM/yyyy HH:mm') : 'PENDIENTE', 300, 170)
      .text('AMBIENTE: ' + (company.sriEnvironment === '1' ? 'PRUEBAS' : 'PRODUCCIÓN'), 300, 190)
      .text('EMISIÓN: ' + (company.sriEmissionType === '1' ? 'NORMAL' : 'CONTINGENCIA'), 300, 205)
      .text('CLAVE DE ACCESO', 300, 225)
      .fontSize(8)
      .text(invoice.invoiceAccessKey, 300, 240);

    doc
      .fontSize(16)
      .text(company.companyName, 50, 100)
      .fontSize(10)
      .text(company.companyTradeName || '', 50, 125)
      .text('Dirección Matriz:', 50, 140)
      .text(company.companyAddress, 50, 155, { width: 200 })
      .text('Obligado a Llevar Contabilidad: ' + company.companyObligedToAccount, 50, 200);

    doc.moveDown();
    const yStart = 300;
    
    doc
      .fontSize(10)
      .text('Razón Social / Nombres y Apellidos: ' + invoice.customer.customerName, 50, yStart)
      .text('Identificación: ' + invoice.customer.customerIdentificationNumber, 400, yStart)
      .text('Fecha Emisión: ' + format(invoice.invoiceCreatedAt, 'dd/MM/yyyy'), 50, yStart + 15)
      .text('Guía Remisión:', 400, yStart + 15);

    const tableTop = 350;
    const itemCodeX = 50;
    const descX = 110;
    const qtyX = 280;
    const priceX = 350;
    const discountX = 420;
    const totalX = 490;

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .text('Cod. Principal', itemCodeX, tableTop)
      .text('Descripción', descX, tableTop)
      .text('Cant', qtyX, tableTop)
      .text('Precio Unitario', priceX, tableTop)
      .text('Descuento', discountX, tableTop)
      .text('Precio Total', totalX, tableTop)
      .font('Helvetica');

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    let y = tableTop + 25;

    invoice.items.forEach((item: any) => {
      doc
        .text(item.product.productCode || item.product.productSku || '', itemCodeX, y)
        .text(item.product.productName, descX, y, { width: 160 })
        .text(item.invoiceItemQuantity.toString(), qtyX, y)
        .text(Number(item.invoiceItemUnitPrice).toFixed(2), priceX, y)
        .text(Number(item.invoiceItemDiscount).toFixed(2), discountX, y)
        .text(Number(item.invoiceItemSubtotal).toFixed(2), totalX, y);
      
      y += 20; 
    });

    const totalsX = 350;
    const valuesX = 490;
    y += 20;

    doc.text('SUBTOTAL 15%', totalsX, y).text(Number(invoice.invoiceSubtotal).toFixed(2), valuesX, y); 
    y += 15;
    doc.text('SUBTOTAL 0%', totalsX, y).text('0.00', valuesX, y); 
    y += 15;
    doc.text('SUBTOTAL Sin Impuestos', totalsX, y).text(Number(invoice.invoiceSubtotal).toFixed(2), valuesX, y);
    y += 15;
    doc.text('DESCUENTO', totalsX, y).text(Number(invoice.invoiceDiscountTotal).toFixed(2), valuesX, y);
    y += 15;
    doc.text('IVA 15%', totalsX, y).text(Number(invoice.invoiceTax).toFixed(2), valuesX, y);
    y += 15;
    doc.fontSize(12).text('VALOR TOTAL', totalsX, y).text(Number(invoice.invoiceTotal).toFixed(2), valuesX, y);

    y += 50;
    doc.fontSize(10).text('Información Adicional', 50, y);
    y += 15;
    doc.fontSize(9).text('Email: ' + invoice.customer.customerEmail, 50, y);
    y += 15;
    if (invoice.customer.customerPhone) {
        doc.text('Teléfono: ' + invoice.customer.customerPhone, 50, y);
    }

    doc.end();
  });
};
