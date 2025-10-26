import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdjustStockDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsNotEmpty()
  quantityChange: number; // Positivo para entrada, negativo para salida

  @IsString()
  @IsOptional()
  reason?: string;
}