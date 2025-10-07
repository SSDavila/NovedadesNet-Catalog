import { Module } from '@nestjs/common';
import { ProductImageService } from './productimage.service';
import { ProductImageController } from './productimage.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [ProductImageController],
  providers: [ProductImageService],
  imports: [PrismaModule, CloudinaryModule],
})
export class ProductImageModule {}