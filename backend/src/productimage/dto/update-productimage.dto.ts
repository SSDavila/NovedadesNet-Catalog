import { PartialType } from '@nestjs/mapped-types';
import { CreateProductImageDto } from './create-productimage.dto';

export class UpdateProductImageDto extends PartialType(CreateProductImageDto) {}
