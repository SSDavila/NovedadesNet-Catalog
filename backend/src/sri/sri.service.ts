import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { generateInvoiceXml } from './utils/xml-generator';
import { SriSigner } from './utils/signer';
import { SriSoap } from './utils/sri-soap';
import { generateRidePdf } from './utils/pdf-generator';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SriService {
  constructor(private prisma: PrismaService) {}

  async processElectronicInvoice(invoiceId: number) {
    console.log(`[SRI] Starting process for invoice ${invoiceId}`);
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
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    const company = await this.prisma.company.findFirst();
    if (!company) {
      throw new NotFoundException('Company configuration not found');
    }
    console.log(`[SRI] Data fetched for invoice ${invoiceId}`);

    if (!invoice.invoiceAccessKey) {
      console.log(`[SRI] Generating access key...`);
      const parts = invoice.invoiceNumber.includes('-') 
        ? invoice.invoiceNumber.split('-') 
        : [
            invoice.invoiceNumber.substring(0, 3),
            invoice.invoiceNumber.substring(3, 6),
            invoice.invoiceNumber.substring(6)
          ];

      const accessKey = this.generateAccessKey(
        invoice.invoiceCreatedAt,
        '01',
        company.companyRuc,
        company.sriEnvironment,
        parts[0], 
        parts[1], 
        parts[2], 
        '12345678' 
      );

      await this.prisma.invoice.update({
        where: { invoiceId },
        data: { invoiceAccessKey: accessKey },
      });
      
      invoice.invoiceAccessKey = accessKey;
      console.log(`[SRI] Access key generated: ${accessKey}`);
    }

    console.log(`[SRI] Generating XML...`);
    const xml = generateInvoiceXml(invoice, company);
    
    let signedXml = xml;
    if (company.sriCertificatePath && company.sriCertificatePassword) {
        try {
            console.log(`[SRI] Signing XML...`);
            const certPath = path.resolve(company.sriCertificatePath);
            if (fs.existsSync(certPath)) {
                signedXml = await SriSigner.signXml(xml, certPath, company.sriCertificatePassword);
                console.log(`[SRI] XML Signed successfully`);
            } else {
                console.warn(`Certificate file not found at ${certPath}. Skipping signing (DEV MODE).`);
            }
        } catch (error) {
            console.error('Signing failed:', error);
            throw new InternalServerErrorException('Failed to sign XML: ' + error.message);
        }
    } else {
        console.warn('No certificate configured. Skipping signing (DEV MODE).');
    }

    await this.prisma.invoice.update({
        where: { invoiceId },
        data: { invoiceSignedXml: signedXml }
    });

    let sriResponse = null;
    try {
        if (company.sriCertificatePath) {
             console.log(`[SRI] Sending to SRI (Recepcion)...`);
             const base64Xml = Buffer.from(signedXml).toString('base64');
             sriResponse = await SriSoap.sendReceipt(base64Xml, company.sriEnvironment === '2');
             console.log(`[SRI] Receipt response:`, JSON.stringify(sriResponse));
        }
    } catch (error) {
        console.error('SRI Receipt failed:', error);
    }

    let authResponse = null;
    const receiptState = sriResponse?.RespuestaRecepcionComprobante?.estado || sriResponse?.estado;
    
    const isAlreadyRegistered = sriResponse && JSON.stringify(sriResponse).includes('CLAVE ACCESO REGISTRADA');

    if (receiptState === 'RECIBIDA' || isAlreadyRegistered) {
        try {
            console.log(`[SRI] Requesting Authorization...`);
            authResponse = await SriSoap.requestAuthorization(invoice.invoiceAccessKey, company.sriEnvironment === '2');
            console.log(`[SRI] Authorization response:`, JSON.stringify(authResponse));
        } catch (error) {
             console.error('SRI Authorization failed:', error);
        }
    } else {
        console.log(`[SRI] Skipping authorization because receipt state is not RECIBIDA. State: ${receiptState}`);
    }

    const updateData: any = {
        invoiceSriResponse: JSON.stringify({ receipt: sriResponse, auth: authResponse }),
    };

    const authResult = authResponse?.RespuestaAutorizacionComprobante || authResponse;

    if (authResult && authResult.autorizaciones && authResult.autorizaciones.autorizacion) {
        const auth = Array.isArray(authResult.autorizaciones.autorizacion) 
            ? authResult.autorizaciones.autorizacion[0] 
            : authResult.autorizaciones.autorizacion;
            
        if (auth.estado === 'AUTORIZADO') {
            updateData.invoiceStatus = 'AUTORIZADO';
            updateData.invoiceSriAuthorizationNumber = auth.numeroAutorizacion;
            updateData.invoiceSriAuthorizationDateTime = new Date(auth.fechaAutorizacion);
        } else {
             updateData.invoiceStatus = 'RECHAZADO'; 
        }
    }

    await this.prisma.invoice.update({
        where: { invoiceId },
        data: updateData
    });

    console.log(`[SRI] Process completed. Status: ${updateData.invoiceStatus || 'GENERADO'}`);
    
    return {
      accessKey: invoice.invoiceAccessKey,
      xml: xml,
      signedXml: signedXml,
      sriResponse: { receipt: sriResponse, auth: authResponse },
      status: updateData.invoiceStatus || 'GENERADO'
    };
  }

  async generateRide(invoiceId: number): Promise<Buffer> {
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
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    const company = await this.prisma.company.findFirst();
    if (!company) {
      throw new NotFoundException('Company configuration not found');
    }

    return generateRidePdf(invoice, company);
  }

  generateAccessKey(
    date: Date,
    codDoc: string,
    ruc: string,
    ambiente: string,
    estab: string,
    ptoEmi: string,
    secuencial: string,
    codigoNumerico: string
  ): string {
    const formatDate = (d: Date) => {
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${day}${month}${year}`;
    };

    const fecha = formatDate(date);
    const tipoEmision = '1';

    const keyWithoutDigit = `${fecha}${codDoc}${ruc}${ambiente}${estab}${ptoEmi}${secuencial}${codigoNumerico}${tipoEmision}`;

    const verifier = this.calculateModulo11(keyWithoutDigit);
    
    return `${keyWithoutDigit}${verifier}`;
  }

  private calculateModulo11(key: string): number {
    let sum = 0;
    let factor = 2;

    for (let i = key.length - 1; i >= 0; i--) {
      sum += parseInt(key.charAt(i), 10) * factor;
      factor = factor === 7 ? 2 : factor + 1;
    }

    const remainder = sum % 11;
    const digit = 11 - remainder;

    if (digit === 11) return 0;
    if (digit === 10) return 1;
    return digit;
  }
}
