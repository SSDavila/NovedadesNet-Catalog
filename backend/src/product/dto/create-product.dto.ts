import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  Min,
  IsPositive,
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
  @Min(0)
  @IsOptional()
  productOfferPrice?: number;

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