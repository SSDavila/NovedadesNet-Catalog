import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as forge from 'node-forge';
import { create } from 'xmlbuilder2';
import axios from 'axios';

@Injectable()
export class SriService {
  private getSriEndpoints(environment: string) {
    if (environment === '2') { 
      return {
        reception: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
        authorization: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
      };
    }
    return {
      reception: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
      authorization: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
    };
  }

  async authorizeInvoice(invoiceData: any, companyData: any): Promise<{ status: string; authorizationNumber?: string; responseXml?: string; signedXml?: string }> {

    const xmlObject = this.buildInvoiceXml(invoiceData, companyData);

    const xmlString = create({ encoding: 'UTF-8' }, xmlObject).end({ prettyPrint: true });

    console.log('--- XML Generado para el SRI ---');
    console.log(xmlString);
    console.log('---------------------------------');

    const signedXml = await this.signXml(xmlString, companyData.sriCertificatePath, companyData.sriCertificatePassword);

    fs.writeFileSync('factura_firmada.xml', signedXml, { encoding: 'utf8' });

    console.log('--- XML Firmado Enviado al SRI ---');
    console.log(signedXml);
    console.log('-----------------------------------');

    const endpoints = this.getSriEndpoints(companyData.sriEnvironment);

    await this.sendToReception(signedXml, endpoints.reception);

    const authResult = await this.checkAuthorization(invoiceData.invoiceAccessKey, endpoints.authorization);

    return { ...authResult, signedXml };
  }

  generateAccessKey(emissionDate: Date, voucherType: string, ruc: string, environment: string, series: string, sequence: string): string {
    const date = new Date(emissionDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const datePart = `${day}${month}${year}`;
    const numericCode = Math.random().toString().slice(2, 10);
    const emissionType = '1';

    const keyWithoutCheckDigit = `${datePart}${voucherType}${ruc}${environment}${series}${sequence}${numericCode}${emissionType}`;
    const checkDigit = this.calculateCheckDigit(keyWithoutCheckDigit);

    return `${keyWithoutCheckDigit}${checkDigit}`;
  }

  private calculateCheckDigit(key: string): number {
    const coefficients = [7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 48; i++) {
      sum += parseInt(key[i], 10) * coefficients[i];
    }
    const remainder = sum % 11;
    const checkDigit = 11 - remainder;
    return checkDigit === 11 ? 0 : checkDigit === 10 ? 1 : checkDigit;
  }

  private buildInvoiceXml(invoice: any, company: any) {

    const invoiceDate = new Date(invoice.invoiceCreatedAt);
    const formattedDate = `${invoiceDate.getDate().toString().padStart(2, '0')}/${(invoiceDate.getMonth() + 1).toString().padStart(2, '0')}/${invoiceDate.getFullYear()}`;

    const taxTotals: { [key: string]: { code: string; codePercentage: string; base: number; value: number; tariff: number } } = {};

    const ivaTariffs: { [key: string]: number } = {
      '0': 0,
      '2': 12,
      '3': 14,
      '4': 15,
      '5': 5,
    };

    const identificationTypeMapping: { [key: string]: string } = {
      'RUC': '04',
      'CEDULA': '05',
      'PASAPORTE': '06',
      'CONSUMIDOR_FINAL': '07',
      'PLACA': '09',
    };

    invoice.items.forEach(item => {
      const ivaRateCode = item.product.productIvaRate;
      const tariff = ivaTariffs[ivaRateCode] ?? 0;
      const base = item.invoiceItemSubtotal.toNumber();
      const value = base * (tariff / 100);

      if (!taxTotals[ivaRateCode]) {
        taxTotals[ivaRateCode] = {
          code: '2',
          codePercentage: ivaRateCode,
          base: 0,
          value: 0,
          tariff,
        };
      }
      taxTotals[ivaRateCode].base += base;
      taxTotals[ivaRateCode].value += value;
    });

    return {
      factura: {
        '@id': 'comprobante',
        '@version': '1.1.0',
        infoTributaria: {
          ambiente: parseInt(company.sriEnvironment, 10),
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
          obligadoContabilidad: company.companyObligedToAccount ?? 'NO',
          tipoIdentificacionComprador: identificationTypeMapping[invoice.customer.customerIdentificationType] || '07',
          razonSocialComprador: invoice.customer.customerName,
          identificacionComprador: invoice.customer.customerIdentificationNumber,
          totalSinImpuestos: invoice.invoiceSubtotal.toFixed(2),
          totalDescuento: invoice.invoiceDiscountTotal.toFixed(2),
          totalConImpuestos: {
            totalImpuesto: Object.values(taxTotals).map(tax => ({
              codigo: tax.code,
              codigoPorcentaje: tax.codePercentage,
              baseImponible: tax.base.toFixed(2),
              tarifa: tax.tariff.toFixed(2),
              valor: tax.value.toFixed(2),
            })),
          },
          propina: '0.00',
          importeTotal: invoice.invoiceTotal.toFixed(2),
          moneda: 'DOLAR',
        },
        detalles: {
          detalle: invoice.items.map(item => {
            const ivaCode = item.product.productIvaRate;
            const tariff = ivaTariffs[ivaCode] ?? 0;

            const impuesto = {
              codigo: '2',
              codigoPorcentaje: ivaCode,
              tarifa: tariff.toFixed(2),
              baseImponible: item.invoiceItemSubtotal.toFixed(2),
              valor: (item.invoiceItemSubtotal.toNumber() * tariff / 100).toFixed(2),
            };

            return {
              codigoPrincipal: item.product.productSku || item.productId,
              descripcion: item.product.productName,
              cantidad: item.invoiceItemQuantity,
              precioUnitario: item.invoiceItemUnitPrice.toFixed(2),
              descuento: item.invoiceItemDiscount.toFixed(2),
              precioTotalSinImpuesto: item.invoiceItemSubtotal.toFixed(2),
              impuestos: { impuesto: [impuesto] },
            };
          }),
        },

        infoAdicional: {
          campoAdicional: {
            '@nombre': 'Email',
            '#': invoice.customer.customerEmail || 'cliente@correo.com',
          },
        },
      },
    };
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

      const signatureXml = this.buildSignatureXml(signatureB64, certB64, forge.util.encode64(md.digest().bytes()));
      return xmlToSign.replace('</factura>', `${signatureXml}</factura>`);
    } catch (error) {
      console.error('Error al firmar el XML:', error);
      throw new InternalServerErrorException('Error al firmar el documento. Verifique la contraseña y la ruta de la firma electrónica.');
    }
  }

  private buildSignatureXml(signatureB64: string, certB64: string, digestB64: string): string {
  const signatureId = 'Signature666';

  const xmlObj = {
    'ds:Signature': {
      '@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
      '@Id': signatureId,
      'ds:SignedInfo': {
        'ds:CanonicalizationMethod': {
          '@Algorithm': 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
        },
        'ds:SignatureMethod': {
          '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',
        },
        'ds:Reference': {
          '@URI': '#comprobante',
          'ds:Transforms': {
            'ds:Transform': {
              '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            },
          },
          'ds:DigestMethod': {
            '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#sha1',
          },
          'ds:DigestValue': digestB64,
        },
      },
      'ds:SignatureValue': signatureB64,
      'ds:KeyInfo': {
        'ds:X509Data': {
          'ds:X509Certificate': certB64,
        },
      },
    },
  };

  return create(xmlObj).end({ headless: true, prettyPrint: false });
}

  private async sendToReception(signedXml: string, endpoint: string): Promise<void> {
    const soapEnvelope = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.recepcion">
       <soapenv:Header/>
       <soapenv:Body>
          <ec:validarComprobante>
             <xml>${Buffer.from(signedXml, 'utf8').toString('base64')}</xml>
          </ec:validarComprobante>
       </soapenv:Body>
    </soapenv:Envelope>`;

    try {
      const response = await axios.post(endpoint, soapEnvelope, {
        headers: { 'Content-Type': 'application/xml; charset=UTF-8' },
      });

      const resultXml = response.data;
      if (!resultXml.includes('<estado>RECIBIDA</estado>')) {
        const errorMessage = resultXml.match(/<mensaje>(.*?)<\/mensaje>/)?.[1] || 'Error desconocido en la recepción del SRI.';
        console.error('Error en la recepción del SRI:', resultXml);
        throw new BadRequestException(`SRI: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error en la recepción del SRI:', error.response?.data || error.message);
      throw new InternalServerErrorException('Fallo la comunicación con el servicio de recepción del SRI.');
    }
  }

  private async checkAuthorization(accessKey: string, endpoint: string): Promise<{ status: string; authorizationNumber?: string; responseXml?: string }> {
    const soapEnvelope = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.autorizacion">
       <soapenv:Header/>
       <soapenv:Body>
          <ec:autorizacionComprobante>
             <claveAccesoComprobante>${accessKey}</claveAccesoComprobante>
          </ec:autorizacionComprobante>
       </soapenv:Body>
    </soapenv:Envelope>`;

    try {
      const response = await axios.post(endpoint, soapEnvelope, { headers: { 'Content-Type': 'text/xml;charset=UTF-8' } });
      const resultXml = response.data;
      const status = resultXml.match(/<estado>(.*?)<\/estado>/)?.[1];

      if (status === 'AUTORIZADO') {
        const authorizationNumber = resultXml.match(/<numeroAutorizacion>(.*?)<\/numeroAutorizacion>/)?.[1];
        return { status, authorizationNumber, responseXml: resultXml };
      } else {
        const message = resultXml.match(/<mensaje>(.*?)<\/mensaje>/)?.[1] || 'Factura no autorizada.';
        throw new BadRequestException(`SRI: ${status} - ${message}`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.error('Error en la autorización del SRI:', error.response?.data || error.message);
      throw new InternalServerErrorException('Fallo la comunicación con el servicio de autorización del SRI.');
    }
  }

  async cancelInvoice(invoice: any, company: any) {
    if (invoice.invoiceStatus !== 'AUTORIZADA') {
      throw new BadRequestException('Solo se pueden anular facturas autorizadas.');
    }

    const cancellationXmlObject = {
      anulacion: {
        infoTributaria: {
          ambiente: parseInt(company.sriEnvironment, 10),
          tipoEmision: 1,
          razonSocial: company.companyName,
          ruc: company.companyRuc,
          claveAcceso: invoice.invoiceAccessKey,
          codDoc: '04',
          estab: invoice.invoiceNumber.substring(0, 3),
          ptoEmi: invoice.invoiceNumber.substring(4, 7),
          secuencial: invoice.invoiceNumber.substring(8, 17),
          dirMatriz: company.companyAddress,
        },
        infoAnulacion: {
          fechaAnulacion: new Date().toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          comprobanteAnular: '01',
          secuencialAnular: invoice.invoiceNumber,
          autorizacionAnular: invoice.invoiceSriAuthorization,
          motivoAnulacion: 'ANULACION SOLICITADA POR EL USUARIO',
        },
      },
    };
    const cancellationXmlString = create(cancellationXmlObject).end({ prettyPrint: true });
    const signedCancellationXml = await this.signXml(cancellationXmlString, company.sriCertificatePath, company.sriCertificatePassword);
    const endpoints = this.getSriEndpoints(company.sriEnvironment);
    await this.sendToReception(signedCancellationXml, endpoints.reception);
  }
}