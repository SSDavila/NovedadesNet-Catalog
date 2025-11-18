import { Controller, Param, Post, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { SriService } from './sri.service';

@Controller('sri')
export class SriController {
  constructor(private readonly sriService: SriService) {}

  /**
   * Endpoint para procesar una factura electrónica completa (firmar, enviar y autorizar).
   * @param id - El ID de la factura a procesar.
   */
  @Post('process-invoice/:id')
  async processInvoice(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.sriService.processElectronicInvoice(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Factura procesada y autorizada exitosamente por el SRI.',
        ...result,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
