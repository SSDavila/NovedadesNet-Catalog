import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Servidor SMTP de Gmail
      port: 465, // Puerto para SSL/TLS
      secure: true, // Usar SSL/TLS
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendInvoiceEmail(to: string, subject: string, html: string, attachments: { filename: string; content: Buffer | string; contentType: string }[]) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to,
        subject,
        html,
        attachments,
      });
    } catch (error) {
      console.error('Error al enviar el correo de la factura:', error);
      throw new InternalServerErrorException('No se pudo enviar el correo electrónico.');
    }
  }
}