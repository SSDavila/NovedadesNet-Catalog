import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateProductImageDto {
  @IsUrl()
  @IsNotEmpty()
  productImageUrl: string;

  @IsString()
  @IsNotEmpty()
  productImagePublicId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;
}