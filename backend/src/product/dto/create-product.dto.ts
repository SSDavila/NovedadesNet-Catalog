import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  productName: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsPositive()
  productPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  productPreviousPrice?: number;

  @IsString()
  @IsOptional()
  productDescription?: string;

  @IsString()
  categoryId: string;

  @IsInt()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  productStock?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagesToDelete?: string[];
}