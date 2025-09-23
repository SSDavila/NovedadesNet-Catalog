import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  Min,
  IsArray,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  prodName: string;

  @IsString()
  @IsOptional()
  prodDesc?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  prodPrice: number;

  @IsArray()
  @IsUrl({}, { each: true }) // Valida que cada elemento del array sea una URL
  @IsOptional()
  prodImages?: string[];

  @IsNumber()
  @Min(0)
  prodStock: number;
}