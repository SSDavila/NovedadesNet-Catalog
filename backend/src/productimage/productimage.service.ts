import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductImageService {
  constructor(private readonly prisma: PrismaService) {}

  async remove(id: number) {
    const productImage = await this.prisma.productImage.findUnique({
      where: { prodImageId: id },
    });

    if (!productImage) {
      throw new NotFoundException(`Imagen con ID "${id}" no encontrada.`);
    }

    return this.prisma.productImage.delete({
      where: { prodImageId: id },
    });
  }
}