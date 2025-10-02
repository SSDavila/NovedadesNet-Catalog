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
  prodName: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsPositive()
  prodPrice: number;

  @IsString()
  @IsOptional()
  prodDescription?: string;

  @IsString()
  @IsOptional()
  prodCategory?: string;

  @IsInt()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  prodStock?: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  prodImages?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagesToDelete?: string[];
}