import { 
  Controller,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  ValidationPipe
} from '@nestjs/common';
import { ProductImageService } from './productimage.service';
import { CreateProductImageDto } from './dto/create-productimage.dto';
import { DeleteManyImagesDto } from './dto/delete-many-images.dto';

@Controller('product-images')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Post()
  create(@Body() createProductImageDto: CreateProductImageDto) {
    return this.productImageService.create(createProductImageDto);
  }

  @Delete('delete-many')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMany(@Body() deleteManyImagesDto: DeleteManyImagesDto) {
    return this.productImageService.removeMany(deleteManyImagesDto.imageIds);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ValidationPipe({ transform: false })) id: string) {
    return this.productImageService.remove(id);
  }
}