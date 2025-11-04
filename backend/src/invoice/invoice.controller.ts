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
} from '@nestjs/common';
import { InvoicesService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SriService } from 'src/sri/sri.service';
import { PdfService } from 'src/pdf/pdf.service';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly sriService: SriService,
    private readonly pdfService: PdfService,
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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.remove(id);
  }
}