import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Asegúrate que la ruta a tu PrismaService sea correcta
import { Company, Customer, Invoice, InvoiceItem, Product } from '@prisma/client';
import * as X2JS from 'x2js';
import * as forge from 'node-forge';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Decimal } from '@prisma/client/runtime/library';

// --- Helper Functions ---

/** Formatea una fecha al formato dd/MM/yyyy requerido por el SRI */
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/** Obtiene el código de tipo de identificación del SRI */
const getIdentificationTypeCode = (type: string): string => {
  const map = { RUC: '04', CEDULA: '05', PASAPORTE: '06', CONSUMIDOR_FINAL: '07', EXTERIOR: '08' };
  return map[type] || '07';
};

/** Obtiene el código de porcentaje de IVA del SRI */
const getIvaCode = (ivaRate: string): string => {
  const map = { '0': '0', '12': '2', '14': '3', '15': '5' }; // '15' es el código para 15%
  return map[ivaRate] || '0';
};

const SRI_ENDPOINTS = {
  pruebas: {
    recepcion: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
    autorizacion: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
  },
  produccion: {
    recepcion: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
    autorizacion: 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
  },
};


@Injectable()
export class SriService {
  private x2js: X2JS;

  constructor(private prisma: PrismaService, private readonly httpService: HttpService) {
    this.x2js = new X2JS();
  }

  /**
   * Genera el objeto base para el XML de la factura a partir de un ID de factura existente.
   * @param invoiceId - El ID de la factura en la base de datos.
   */
  async generateInvoiceXmlObject(invoiceId: number): Promise<object> {
    // 1. --- Obtener todos los datos necesarios de la base de datos ---
    const invoice = await this.prisma.invoice.findUnique({
      where: { invoiceId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Factura con ID ${invoiceId} no encontrada.`);
    }

    const company = await this.prisma.company.findFirst();
    if (!company) {
      throw new Error('No se ha configurado la información de la empresa.');
    }

    // 2. --- Construir el objeto con la estructura exacta del XML ---
    const secuencial = invoice.invoiceNumber.split('-')[2];

    // totalSinImpuestos es la suma de los subtotales de cada item (que ya tienen el descuento aplicado).
    const totalSinImpuestos = invoice.invoiceSubtotal;

    // Agrupamos los items por su tarifa de IVA para generar los totales
    const impuestosPorTarifa = invoice.items.reduce((acc, item) => {
      const ivaRate = item.product.productIvaRate;
      if (!acc[ivaRate]) {
        acc[ivaRate] = { baseImponible: new Decimal(0), valor: new Decimal(0) };
      }
      const baseImponibleItem = item.invoiceItemSubtotal;
      acc[ivaRate].baseImponible = acc[ivaRate].baseImponible.plus(baseImponibleItem);
      acc[ivaRate].valor = acc[ivaRate].valor.plus(baseImponibleItem.mul(new Decimal(ivaRate).div(100)));
      return acc;
    }, {} as Record<string, { baseImponible: Decimal; valor: Decimal }>);

    const facturaJson = {
      factura: {
        _id: 'comprobante',
        _version: '2.1.0',
        infoTributaria: {
          ambiente: company.sriEnvironment, // '1' Pruebas, '2' Producción
          tipoEmision: company.sriEmissionType, // '1' Emisión Normal
          razonSocial: company.companyName,
          nombreComercial: company.companyTradeName || company.companyName,
          ruc: company.companyRuc,
          claveAcceso: invoice.invoiceAccessKey,
          codDoc: '01', // '01' para Factura
          estab: company.companyEstablishmentCode,
          ptoEmi: company.companyEmissionPointCode,
          secuencial: secuencial,
          dirMatriz: company.companyAddress,
        },
        infoFactura: {
          fechaEmision: formatDate(invoice.invoiceCreatedAt),
          dirEstablecimiento: company.companyAddress,
          obligadoContabilidad: company.companyObligedToAccount,
          tipoIdentificacionComprador: getIdentificationTypeCode(invoice.customer.customerIdentificationType),
          razonSocialComprador: invoice.customer.customerName,
          identificacionComprador: invoice.customer.customerIdentificationNumber,
          totalSinImpuestos: totalSinImpuestos.toFixed(2),
          totalDescuento: invoice.invoiceDiscountTotal.toFixed(2),
          totalConImpuestos: {
            totalImpuesto: Object.entries(impuestosPorTarifa).map(([ivaRate, totals]) => ({ // Este se convierte en un array
              codigo: '2', // '2' para IVA
              codigoPorcentaje: getIvaCode(ivaRate),
              baseImponible: totals.baseImponible.toFixed(2),
              valor: totals.valor.toFixed(2),
            })),
          },
          propina: '0.00',
          importeTotal: invoice.invoiceTotal.toFixed(2),
          moneda: 'DOLAR',
          pagos: {
            pago: [ // Forzamos a que sea un array
              {
                formaPago: invoice.invoicePaymentMethod,
                total: invoice.invoiceTotal.toFixed(2),
              }
            ]
          },
        },
        detalles: {
          detalle: invoice.items.map((item) => {
            const subtotalSinDescuento = item.invoiceItemSubtotal.plus(item.invoiceItemDiscount);
            const ivaRate = item.product.productIvaRate;
            const valorIva = item.invoiceItemSubtotal.mul(new Decimal(ivaRate).div(100));

            return {
              codigoPrincipal: item.product.productId,
              codigoAuxiliar: item.product.productSku || item.product.productId,
              descripcion: item.product.productName,
              cantidad: item.invoiceItemQuantity.toFixed(6), // El SRI recomienda 6 decimales para cantidad
              precioUnitario: subtotalSinDescuento.div(item.invoiceItemQuantity).toFixed(6), // El SRI recomienda 6 decimales
              descuento: item.invoiceItemDiscount.toFixed(2),
              precioTotalSinImpuesto: item.invoiceItemSubtotal.toFixed(2),
              impuestos: {
                impuesto: [ // Forzamos a que sea un array
                  {
                    codigo: '2', 
                    codigoPorcentaje: getIvaCode(ivaRate), 
                    tarifa: ivaRate, 
                    baseImponible: item.invoiceItemSubtotal.toFixed(2), 
                    valor: valorIva.toFixed(2) 
                  }
                ]
              },
            };
          }),
        },
      },
    };

    return facturaJson;
  }

  /**
   * Genera el string XML de la factura, listo para ser firmado.
   * @param invoiceId - El ID de la factura.
   * @returns El string XML de la factura.
   */
  async generateXmlString(invoiceId: number): Promise<string> {
    const jsonObject = await this.generateInvoiceXmlObject(invoiceId);
    const xmlString = this.x2js.js2xml(jsonObject);

    // El SRI requiere la declaración XML específica como encabezado.
    return `<?xml version="1.0" encoding="UTF-8"?>\n${xmlString}`;
  }

  /**
   * Firma un documento XML utilizando un certificado P12.
   * @param xmlToSign - El string XML sin firmar.
   * @param certificatePath - La ruta al archivo .p12.
   * @param password - La contraseña del certificado.
   * @returns El string XML firmado.
   */
  private async signXml(xmlToSign: string, certificatePath: string, password: string): Promise<string> {
    const p12Der = await fs.readFile(certificatePath, { encoding: 'binary' });
    const p12Asn1 = forge.asn1.fromDer(p12Der, false);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
    const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });

    const cert = certBags[forge.pki.oids.certBag][0].cert;
    const key = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;

    const certDer = forge.pki.pemToDer(forge.pki.certificateToPem(cert));
    const certB64 = forge.util.encode64(certDer.getBytes());

    const certificateX509 = forge.pki.certificateFromPem(forge.pki.certificateToPem(cert));

    const serialNumber = certificateX509.serialNumber;
    const issuerName = this.formatIssuer(certificateX509.issuer.attributes);

    const signedPropertiesId = `Signature${Date.now()}-SignedProperties${Date.now()}`;
    const signatureId = `Signature${Date.now()}`;
    const referenceId = `Reference-ID-${Date.now()}`;

    const signedProperties = `
      <xades:SignedProperties Id="${signedPropertiesId}">
        <xades:SignedSignatureProperties>
          <xades:SigningTime>${new Date().toISOString()}</xades:SigningTime>
          <xades:SigningCertificate>
            <xades:Cert>
              <xades:CertDigest>
                <ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></ds:DigestMethod>
                <ds:DigestValue>${(() => {
                  const md = forge.md.sha1.create();
                  md.update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes());
                  return forge.util.encode64(md.digest().bytes());
                })()}</ds:DigestValue>
              </xades:CertDigest>
              <xades:IssuerSerial>
                <ds:X509IssuerName>${issuerName}</ds:X509IssuerName>
                <ds:X509SerialNumber>${serialNumber}</ds:X509SerialNumber>
              </xades:IssuerSerial>
            </xades:Cert>
          </xades:SigningCertificate>
        </xades:SignedSignatureProperties>
      </xades:SignedProperties>
    `;

    const md = forge.md.sha1.create();
    md.update(signedProperties, 'utf8');
    const signedPropertiesDigest = forge.util.encode64(md.digest().bytes());

    const mdComprobante = forge.md.sha1.create();
    mdComprobante.update(xmlToSign.replace('<?xml version="1.0" encoding="UTF-8"?>\n', ''), 'utf8');
    const comprobanteDigest = forge.util.encode64(mdComprobante.digest().bytes());

    const signedInfo = `
      <ds:SignedInfo>
        <ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"></ds:CanonicalizationMethod>
        <ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"></ds:SignatureMethod>
        <ds:Reference Id="${referenceId}" URI="#comprobante">
          <ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"></ds:Transform></ds:Transforms>
          <ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></ds:DigestMethod>
          <ds:DigestValue>${comprobanteDigest}</ds:DigestValue>
        </ds:Reference>
        <ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#${signedPropertiesId}">
          <ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></ds:DigestMethod>
          <ds:DigestValue>${signedPropertiesDigest}</ds:DigestValue>
        </ds:Reference>
      </ds:SignedInfo>
    `;

    const mdSignedInfo = forge.md.sha1.create();
    mdSignedInfo.update(signedInfo.replace(/<ds:SignedInfo>/g, '<ds:SignedInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#">'), 'utf8');
    const signatureValue = forge.util.encode64(key.sign(mdSignedInfo));

    const xades = `
      <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="${signatureId}">
        ${signedInfo}
        <ds:SignatureValue>${signatureValue}</ds:SignatureValue>
        <ds:KeyInfo>
          <ds:X509Data>
            <ds:X509Certificate>${certB64}</ds:X509Certificate>
          </ds:X509Data>
        </ds:KeyInfo>
        <ds:Object>
          <xades:QualifyingProperties Target="#${signatureId}">
            ${signedProperties}
          </xades:QualifyingProperties>
        </ds:Object>
      </ds:Signature>
    `;

    return xmlToSign.replace('</factura>', xades + '</factura>');
  }

  private formatIssuer(attributes: any[]): string {
    return attributes.map(attr => `${attr.shortName}=${attr.value}`).reverse().join(', ');
  }

  /**
   * Envía un XML firmado al Web Service de Recepción del SRI.
   * @param signedXml - El XML firmado.
    try {
      const p12File = await fs.readFile(certificatePath, 'binary');
      const p12Asn1 = forge.asn1.fromDer(p12File, false);
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

      const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
      const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });

      const cert = certBags[forge.pki.oids.certBag][0].cert;
      const key = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;

      const certPem = forge.pki.certificateToPem(cert);
      const certData = forge.util.encode64(forge.pki.pemToDer(certPem).getBytes());

      const md = forge.md.sha1.create();
      md.update(xmlToSign, 'utf8');

      // Al pasar solo el digest 'md' (que es sha1), node-forge usa el esquema por defecto RSASSA-PKCS1-v1_5, que es RSA-SHA1.
      const signature = key.sign(md);
      const signature64 = forge.util.encode64(signature);

      const signedXml = xmlToSign.replace(
        '</factura>',
        `<ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature620391">
          <ds:SignedInfo>
            <ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" />
            <ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1" />
            <ds:Reference Id="Reference43526" URI="#comprobante">
              <ds:Transforms>
                <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" />
              </ds:Transforms>
              <ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" />
              <ds:DigestValue>${forge.util.encode64(md.digest().bytes())}</ds:DigestValue>
            </ds:Reference>
          </ds:SignedInfo>
          <ds:SignatureValue>${signature64}</ds:SignatureValue>
          <ds:KeyInfo Id="KeyInfo43897">
            <ds:X509Data>
              <ds:X509Certificate>${certData}</ds:X509Certificate>
            </ds:X509Data>
          </ds:KeyInfo>
        </ds:Signature>`,
      );

      return signedXml;
    } catch (error) {
      console.error('Error al firmar el XML:', error);
      throw new Error(`Error al firmar el documento: ${error.message}`);
    }
  }

  /**
   * Envía un XML firmado al Web Service de Recepción del SRI.
   * @param signedXml - El XML firmado.
   * @returns El resultado de la recepción.
   */
  async sendSignedXml(signedXml: string) {
    const company = await this.prisma.company.findFirst();
    if (!company) {
      throw new Error('No se ha configurado la información de la empresa.');
    }

    const environment = company.sriEnvironment === '1' ? 'pruebas' : 'produccion';
    const url = SRI_ENDPOINTS[environment].recepcion;

    const xmlBase64 = Buffer.from(signedXml).toString('base64');

    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.recepcion">
        <soapenv:Header/>
        <soapenv:Body>
          <ec:validarComprobante>
            <xml>${xmlBase64}</xml>
          </ec:validarComprobante>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    try {
      const { data } = await axios.post(url, soapBody, {
        headers: { 'Content-Type': 'text/xml;charset=UTF-8' },
      });

      // Parsear la respuesta SOAP
      const responseJson = this.x2js.xml2js(data) as any;
      const body = responseJson.Envelope.Body;

      if (body.validarComprobanteResponse) {
        return body.validarComprobanteResponse.RespuestaRecepcionComprobante;
      } else if (body.Fault) {
        throw new Error(`Error del SRI: ${JSON.stringify(body.Fault.faultstring)}`);
      }
      throw new Error('Respuesta inesperada del SRI.');
    } catch (error) {
      console.error('Error en la petición al SRI:', error.response?.data || error.message);
      throw new Error('No se pudo comunicar con el servicio de recepción del SRI.');
    }
  }

  /**
   * Consulta el Web Service de Autorización del SRI.
   * @param accessKey - La clave de acceso del comprobante.
   */
  async checkAuthorization(accessKey: string) {
    const company = await this.prisma.company.findFirst();
    if (!company) {
      throw new Error('No se ha configurado la información de la empresa.');
    }

    const environment = company.sriEnvironment === '1' ? 'pruebas' : 'produccion';
    const url = SRI_ENDPOINTS[environment].autorizacion;

    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.autorizacion">
        <soapenv:Header/>
        <soapenv:Body>
          <ec:autorizacionComprobante>
            <claveAccesoComprobante>${accessKey}</claveAccesoComprobante>
          </ec:autorizacionComprobante>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    try {
      const { data } = await axios.post(url, soapBody, {
        headers: { 'Content-Type': 'text/xml;charset=UTF-8' },
      });

      const responseJson = this.x2js.xml2js(data) as any;
      const body = responseJson.Envelope.Body;

      if (body.autorizacionComprobanteResponse) {
        const respuesta = body.autorizacionComprobanteResponse.RespuestaAutorizacionComprobante;
        // El SRI devuelve una lista de autorizaciones, usualmente con un solo elemento.
        return respuesta.autorizaciones.autorizacion;
      } else if (body.Fault) {
        throw new Error(`Error del SRI: ${JSON.stringify(body.Fault.faultstring)}`);
      }
      throw new Error('Respuesta inesperada del SRI en autorización.');
    } catch (error) {
      console.error('Error en la petición de autorización al SRI:', error.response?.data || error.message);
      throw new Error('No se pudo comunicar con el servicio de autorización del SRI.');
    }
  }

  /**
   * Orquesta todo el proceso de una factura electrónica:
   * 1. Genera y firma el XML.
   * 2. Envía para recepción.
   * 3. Consulta la autorización.
   * 4. Actualiza la base de datos.
   * @param invoiceId - El ID de la factura a procesar.
   */
  async processElectronicInvoice(invoiceId: number) {
    // --- 1. Generar y firmar XML ---
    const unsignedXml = await this.generateXmlString(invoiceId);
    const invoiceData = await this.prisma.invoice.findUnique({ where: { invoiceId } });
    const company = await this.prisma.company.findFirst();

    if (!company || !company.sriCertificatePath || !company.sriCertificatePassword) {
      throw new Error('La configuración del certificado digital de la empresa no está completa.');
    }
    if (!invoiceData) {
      throw new NotFoundException('Factura no encontrada para procesar.');
    }

    // --- Guardar XML sin firmar para depuración ---
    const xmlDir = path.join(process.cwd(), 'xml_generated');
    await fs.mkdir(xmlDir, { recursive: true });
    await fs.writeFile(path.join(xmlDir, `${invoiceData.invoiceNumber}-unsigned.xml`), unsignedXml);
    // ------------------------------------------------

    const signedXml = await this.signXml(unsignedXml, company.sriCertificatePath, company.sriCertificatePassword);

    await this.prisma.invoice.update({
      where: { invoiceId },
      data: { invoiceSignedXml: signedXml, invoiceStatus: 'FIRMADO' },
    });

    // --- Guardar XML firmado para depuración ---
    await fs.writeFile(path.join(xmlDir, `${invoiceData.invoiceNumber}-signed.xml`), signedXml);
    // -------------------------------------------

    // --- 2. Enviar para Recepción ---
    const receptionResponse = await this.sendSignedXml(signedXml);
    if (receptionResponse.estado !== 'RECIBIDA') {
      const errorMessage = receptionResponse.comprobantes.comprobante.mensajes.mensaje.informacionAdicional;
      await this.prisma.invoice.update({
        where: { invoiceId },
        data: { invoiceStatus: 'RECHAZADO', invoiceSriResponse: JSON.stringify(receptionResponse) },
      });
      throw new Error(`El SRI no recibió la factura. Error: ${errorMessage}`);
    }

    await this.prisma.invoice.update({
      where: { invoiceId },
      data: { invoiceStatus: 'RECIBIDA' },
    });

    // --- 3. Consultar Autorización (con una pausa) ---
    await new Promise(resolve => setTimeout(resolve, 3000)); // Pausa de 3 segundos

    const authResponse = await this.checkAuthorization(invoiceData.invoiceAccessKey);

    // --- 4. Actualizar la Base de Datos ---
    if (authResponse.estado === 'AUTORIZADO') {
      await this.prisma.invoice.update({
        where: { invoiceId },
        data: {
          invoiceStatus: 'AUTORIZADO',
          invoiceSriAuthorizationDateTime: new Date(authResponse.fechaAutorizacion),
          invoiceSriAuthorizationNumber: authResponse.numeroAutorizacion,
          invoiceSriResponse: JSON.stringify(authResponse),
        },
      });
      return { success: true, message: 'Factura autorizada por el SRI.', data: authResponse };
    } else {
      const errorMessage = authResponse.mensajes.mensaje.informacionAdicional;
      await this.prisma.invoice.update({
        where: { invoiceId },
        data: { invoiceStatus: 'NO AUTORIZADO', invoiceSriResponse: JSON.stringify(authResponse) },
      });
      throw new Error(`Factura no autorizada. Error: ${errorMessage}`);
    }
  }
}
