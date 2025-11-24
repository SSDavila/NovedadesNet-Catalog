import { create } from 'xmlbuilder2';
import { format } from 'date-fns';

export const generateInvoiceXml = (invoice: any, company: any) => {
  const formatDate = (date: Date) => format(date, 'dd/MM/yyyy');

  const invoiceParts = invoice.invoiceNumber.includes('-') 
    ? invoice.invoiceNumber.split('-') 
    : [
        invoice.invoiceNumber.substring(0, 3),
        invoice.invoiceNumber.substring(3, 6),
        invoice.invoiceNumber.substring(6)
      ];

  const infoTributaria = {
    ambiente: company.sriEnvironment,
    tipoEmision: company.sriEmissionType,
    razonSocial: company.companyName,
    nombreComercial: company.companyTradeName || company.companyName,
    ruc: company.companyRuc,
    claveAcceso: invoice.invoiceAccessKey,
    codDoc: '01',
    estab: invoiceParts[0],
    ptoEmi: invoiceParts[1],
    secuencial: invoiceParts[2],
    dirMatriz: company.companyAddress,
  };

  const infoFactura = {
    fechaEmision: formatDate(invoice.invoiceCreatedAt),
    dirEstablecimiento: company.companyAddress,
    obligadoContabilidad: company.companyObligedToAccount,
    tipoIdentificacionComprador: getIdentificationType(invoice.customer.customerIdentificationType),
    razonSocialComprador: invoice.customer.customerName,
    identificacionComprador: invoice.customer.customerIdentificationNumber,
    direccionComprador: invoice.customer.customerAddress || 'S/D',
    totalSinImpuestos: invoice.invoiceSubtotal.toFixed(2),
    totalDescuento: invoice.invoiceDiscountTotal.toFixed(2),
    totalConImpuestos: {
      totalImpuesto: [
        {
          codigo: '2', 
          codigoPorcentaje: getIvaCode(invoice.items),
          baseImponible: invoice.invoiceSubtotal.toFixed(2),
          valor: invoice.invoiceTax.toFixed(2),
        }
      ]
    },
    propina: '0.00',
    importeTotal: invoice.invoiceTotal.toFixed(2),
    moneda: 'DOLAR',
    pagos: {
      pago: {
        formaPago: invoice.invoicePaymentMethod,
        total: invoice.invoiceTotal.toFixed(2),
      }
    }
  };

  const detalles = {
    detalle: invoice.items.map((item: any) => ({
      codigoPrincipal: item.product.productCode || item.product.productSku || 'N/A',
      descripcion: item.product.productName,
      cantidad: item.invoiceItemQuantity.toFixed(2),
      precioUnitario: item.invoiceItemUnitPrice.toFixed(2),
      descuento: item.invoiceItemDiscount.toFixed(2),
      precioTotalSinImpuesto: item.invoiceItemSubtotal.toFixed(2),
      impuestos: {
        impuesto: {
          codigo: '2', // IVA
          codigoPorcentaje: getIvaRateCode(item.product.productIvaRate),
          tarifa: item.product.productIvaRate,
          baseImponible: item.invoiceItemSubtotal.toFixed(2),
          valor: (item.invoiceItemSubtotal * (parseFloat(item.product.productIvaRate) / 100)).toFixed(2)
        }
      }
    }))
  };

  const xmlObj = {
    factura: {
      '@id': 'comprobante',
      '@version': '1.0.0',
      infoTributaria,
      infoFactura,
      detalles,
    }
  };

  const doc = create({ version: '1.0', encoding: 'UTF-8' }, xmlObj);
  return doc.end({ prettyPrint: false });
};

function getIdentificationType(type: string): string {
  const types: Record<string, string> = {
    'RUC': '04',
    'CEDULA': '05',
    'PASAPORTE': '06',
    'CONSUMIDOR_FINAL': '07',
    'EXTERIOR': '08',
  };
  return types[type] || '07';
}

function getIvaRateCode(rate: string): string {
  const rates: Record<string, string> = {
    '0': '0',
    '12': '2',
    '14': '3',
    '15': '4', 
    '5': '5',
  };
  return rates[rate] || '0';
}

function getIvaCode(items: any[]): string {
    if (items.length === 0) return '0';
    return getIvaRateCode(items[0].product.productIvaRate);
}
