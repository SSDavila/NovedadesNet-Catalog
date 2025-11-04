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
    const invoiceDate = new Date(invoiceData.invoiceCreatedAt);
    const formattedDate = `${invoiceDate.getDate().toString().padStart(2, '0')}/${(invoiceDate.getMonth() + 1).toString().padStart(2, '0')}/${invoiceDate.getFullYear()}`;

    const xmlObject = this.buildInvoiceXml(invoiceData, companyData, formattedDate);
    const xmlString = create(xmlObject).end({ prettyPrint: true });

    const signedXml = await this.signXml(xmlString, companyData.sriCertificatePath, companyData.sriCertificatePassword);

    const endpoints = this.getSriEndpoints(companyData.sriEnvironment);

    await this.sendToReception(signedXml, endpoints.reception);

    const authResult = await this.checkAuthorization(invoiceData.invoiceAccessKey, endpoints.authorization);

    return { ...authResult, signedXml };
  }

  private buildInvoiceXml(invoice: any, company: any, formattedDate: string) {
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
          obligadoContabilidad: 'SI', 
          tipoIdentificacionComprador: invoice.customer.customerIdentificationType,
          razonSocialComprador: invoice.customer.customerName,
          identificacionComprador: invoice.customer.customerIdentificationNumber,
          totalSinImpuestos: invoice.invoiceSubtotal.toFixed(2),
          totalDescuento: '0.00',
          totalConImpuestos: {
            totalImpuesto: [{
              codigo: '2',
              codigoPorcentaje: '2',
              baseImponible: invoice.invoiceSubtotal.toFixed(2),
              valor: (invoice.invoiceTotal.toNumber() - invoice.invoiceSubtotal.toNumber()).toFixed(2),
            }],
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

  private buildSignatureXml(signatureB64: string, certB64: string, digestB64: string) {
    return create({
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
    }).end();
  }

  private async sendToReception(signedXml: string, endpoint: string): Promise<void> {
    const soapEnvelope = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.recepcion">
       <soapenv:Header/>
       <soapenv:Body>
          <ec:validarComprobante>
             <xml>${Buffer.from(signedXml).toString('base64')}</xml>
          </ec:validarComprobante>
       </soapenv:Body>
    </soapenv:Envelope>`;

    try {
      const response = await axios.post(endpoint, soapEnvelope, { headers: { 'Content-Type': 'text/xml;charset=UTF-8' } });
      const resultXml = create(response.data).end();
      if (!resultXml.includes('<estado>RECIBIDA</estado>')) {
        const errorMessage = resultXml.match(/<mensaje>(.*?)<\/mensaje>/)?.[1] || 'Error desconocido en la recepción del SRI.';
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
          codDoc: '04', // Anulación
          estab: invoice.invoiceNumber.substring(0, 3),
          ptoEmi: invoice.invoiceNumber.substring(4, 7),
          secuencial: invoice.invoiceNumber.substring(8, 17),
          dirMatriz: company.companyAddress,
        },
        infoAnulacion: {
          fechaAnulacion: new Date().toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          comprobanteAnular: '01', // Factura
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