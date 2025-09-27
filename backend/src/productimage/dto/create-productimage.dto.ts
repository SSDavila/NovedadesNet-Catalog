import { IsString, IsUrl } from 'class-validator';

export class CreateProductImageDto {
  @IsUrl()
  prodImageUrl: string;

  @IsString()
  prodId: string;
}
