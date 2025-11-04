import { IsIn, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['PAGADA', 'ANULADA'])
  invoiceStatus: string;

  @IsString()
  @IsOptional()
  invoiceSriAuthorization?: string;

  @IsString()
  @IsOptional()
  invoiceSriResponse?: string;
}