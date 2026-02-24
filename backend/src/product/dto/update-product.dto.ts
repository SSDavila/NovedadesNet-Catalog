import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsArray, IsOptional, IsString, IsDefined } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @IsDefined()
  imagesToDelete?: string[];

  @IsString()
  @IsOptional()
  sellerCommissions?: string;
}
