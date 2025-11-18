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
  NotFoundException,
  InternalServerErrorException,
  HttpCode, 
  HttpStatus,
} from '@nestjs/common';
import { InvoicesService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PdfService } from 'src/pdf/pdf.service';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
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
  findAll(@Req() req) {
    const sellerId = req.user.userId;
    return this.invoicesService.findAll(sellerId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.findOne(id);
  }

  @Get(':id/print')
  async print(@Param('id', ParseIntPipe) id: number, @Res() res) {
    const invoice = await this.invoicesService.findOne(id);
    const company = await this.invoicesService.findCompany();

    if (!company) {
      throw new InternalServerErrorException('Datos de la empresa no configurados.');
    }
    const pdfBuffer = await this.pdfService.generateInvoicePdf(invoice, company);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=factura-${id}.pdf`,
    });

    res.send(pdfBuffer);
  }

  @Get(':id/pdf')
  async downloadPdf(@Param('id', ParseIntPipe) id: number, @Res() res) {
    const { pdfBuffer, filename } = await this.invoicesService.generateInvoicePdf(id);
    res.header('Content-Type', 'application/pdf');
    res.header('Content-Disposition', `attachment; filename=${filename}`);
    res.send(pdfBuffer);
  }

  @Post(':id/send-email')
  @HttpCode(HttpStatus.OK)
  async sendByEmail(@Param('id', ParseIntPipe) id: number) {
    await this.invoicesService.sendInvoiceByEmail(id);
    return {
      message: 'La factura ha sido enviada por correo electrónico exitosamente.',
    };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.cancel(id);
  }
}