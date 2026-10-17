import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
  Min,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class SaleNoteItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsBoolean()
  @IsOptional()
  hasIva?: boolean;
}

export class CreateSaleNoteDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleNoteItemDto)
  items: SaleNoteItemDto[];
}