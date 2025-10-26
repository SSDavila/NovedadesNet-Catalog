import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['PAGADA', 'ANULADA'])
  invoiceStatus: string;
}