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
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  productName: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsPositive()
  productPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? undefined : Number(value)))
  @Min(0)
  @IsOptional()
  productOfferPrice?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Transform(({ value }) => (value === '' || value === null || value === undefined ? undefined : Number(value)))
  @Min(0)
  @IsOptional()
  productCost?: number;

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

  @IsString()
  @IsOptional()
  sellerCommissions?: string;
}