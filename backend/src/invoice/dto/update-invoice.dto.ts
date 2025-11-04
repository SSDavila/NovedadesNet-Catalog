import { IsString, IsOptional } from 'class-validator';

export class UpdateInvoiceDto {
  @IsString()
  @IsOptional()
  invoiceStatus?: string;

  @IsString()
  @IsOptional()
  invoiceSriAuthorization?: string;

  @IsString()
  @IsOptional()
  invoiceSriResponse?: string;

  @IsString()
  @IsOptional()
  invoiceSignedXml?: string;
}