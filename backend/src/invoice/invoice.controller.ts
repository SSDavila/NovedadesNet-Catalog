import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  ValidationPipe,
  Res,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { InvoicesService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SriService } from 'src/sri/sri.service';
import { PdfService } from 'src/pdf/pdf.service';
import { EmailService } from 'src/email/email.service';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly sriService: SriService,
    private readonly pdfService: PdfService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createInvoiceDto: CreateInvoiceDto,
    @Req() req,
  ) {
    const sellerId = req.user.userId;
    return this.invoicesService.create(createInvoiceDto, sellerId);
  }

  @Get()
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.findOne(id);
  }

  @Post(':id/authorize')
  async authorize(@Param('id', ParseIntPipe) id: number) {
    const invoice = await this.invoicesService.findOne(id);
    const company = await this.invoicesService.findCompany();

    const authResult = await this.sriService.authorizeInvoice(invoice, company);

    return this.invoicesService.update(id, {
      invoiceStatus: authResult.status,
      invoiceSriAuthorization: authResult.authorizationNumber,
      invoiceSignedXml: authResult.signedXml,
      invoiceSriResponse: authResult.responseXml,
    });
  }

  @Get(':id/print')
  async print(@Param('id', ParseIntPipe) id: number, @Res() res) {
    const invoice = await this.invoicesService.findOne(id);
    const company = await this.invoicesService.findCompany();

    if (!company) {
      throw new Error('Datos de la empresa no configurados.');
    }
    const pdfBuffer = await this.pdfService.generateInvoicePdf(invoice, company);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=factura-${id}.pdf`,
    });

    res.send(pdfBuffer);
  }

  @Get(':id/download-xml')
  async downloadXml(@Param('id', ParseIntPipe) id: number, @Res() res) {
    const invoice = await this.invoicesService.findOne(id);

    if (!invoice.invoiceSignedXml) {
      throw new NotFoundException('El XML firmado para esta factura no está disponible.');
    }

    res.set({
      'Content-Type': 'application/xml',
      'Content-Disposition': `attachment; filename=factura-${invoice.invoiceNumber}.xml`,
    });

    res.send(invoice.invoiceSignedXml);
  }

  @Post(':id/send-email')
  async sendEmail(@Param('id', ParseIntPipe) id: number) {
    const invoice = await this.invoicesService.findOne(id);
    const company = await this.invoicesService.findCompany();

    if (invoice.invoiceStatus !== 'AUTORIZADA') {
      throw new BadRequestException('Solo se pueden enviar por correo las facturas autorizadas.');
    }
    if (!invoice.customer.customerEmail) {
      throw new BadRequestException('El cliente no tiene una dirección de correo electrónico registrada.');
    }

    const pdfBuffer = await this.pdfService.generateInvoicePdf(invoice, company);

    await this.emailService.sendInvoiceEmail(
      invoice.customer.customerEmail,
      `Factura Electrónica ${invoice.invoiceNumber} de ${company.companyName}`,
      `<p>Estimado/a ${invoice.customer.customerName},</p><p>Adjuntamos su factura electrónica N° ${invoice.invoiceNumber}.</p><p>Gracias por su compra.</p>`,
      [
        { filename: `factura-${invoice.invoiceNumber}.pdf`, content: pdfBuffer, contentType: 'application/pdf' },
        { filename: `factura-${invoice.invoiceNumber}.xml`, content: invoice.invoiceSignedXml, contentType: 'application/xml' },
      ]
    );

    return { message: 'Correo enviado con éxito.' };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const invoice = await this.invoicesService.findOne(id);
    const company = await this.invoicesService.findCompany();

    await this.sriService.cancelInvoice(invoice, company);

    await this.invoicesService.update(id, { invoiceStatus: 'ANULADA' });

    return this.invoicesService.findOne(id);
  }
}