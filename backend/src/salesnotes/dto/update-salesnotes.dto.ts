import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleNoteDto } from './create-salesnotes.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

export const saleNoteStatuses = ['PENDIENTE', 'COMPLETADA', 'CANCELADA'] as const;
export type SaleNoteStatusType = (typeof saleNoteStatuses)[number];

export class UpdateSaleNoteDto extends PartialType(CreateSaleNoteDto) {
  @IsString()
  @IsOptional()
  @IsIn(saleNoteStatuses)
  saleNoteStatus?: SaleNoteStatusType;
}