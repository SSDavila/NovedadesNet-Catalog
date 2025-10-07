import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateProductImageDto {
  @IsUrl()
  @IsNotEmpty()
  prodImageUrl: string;

  @IsString()
  @IsNotEmpty()
  prodImagePublicid: string;

  @IsString()
  @IsNotEmpty()
  prodId: string;
}