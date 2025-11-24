import { Controller, Param, Post, Get, Res, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { SriService } from './sri.service';
import { Response } from 'express';

@Controller('sri')
export class SriController {
  constructor(private readonly sriService: SriService) {}
  
  @Post('process-invoice/:id')
  async processInvoice(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.sriService.processElectronicInvoice(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Proceso de facturación electrónica completado.',
        data: result,
      };
    } catch (error) {
      console.error('Error processing invoice:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message || 'Error interno al procesar la factura',
          details: error.response?.data || error.stack,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('ride/:id')
  async getRide(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const pdfBuffer = await this.sriService.generateRide(id);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=factura-${id}.pdf`,
        'Content-Length': pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (error) {
      console.error('Error generating RIDE:', error);
       throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message || 'No se pudo generar el RIDE',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
