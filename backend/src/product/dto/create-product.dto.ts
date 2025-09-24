import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  Min,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  prodName: string;

  @IsString()
  @IsOptional()
  prodDesc?: string;

  @IsString()
  @IsOptional()
  prodCategory?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  prodPrice: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  prodStock: number;
}