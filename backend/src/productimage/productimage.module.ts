import { Module } from '@nestjs/common';
import { ProductImageService } from './productimage.service';
import { ProductImageController } from './productimage.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  controllers: [ProductImageController],
  providers: [ProductImageService],
  imports: [PrismaModule],
})
export class ProductImageModule {}