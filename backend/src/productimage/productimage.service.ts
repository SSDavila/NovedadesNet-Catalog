import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductImageDto } from './dto/create-productimage.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(createProductImageDto: CreateProductImageDto) {
    const { prodId, ...imageData } = createProductImageDto;

    const product = await this.prisma.product.findUnique({
      where: { prodId },
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID "${prodId}" no encontrado.`);
    }

    const imageCount = await this.prisma.productImage.count({
      where: { prodId },
    });

    const newImageId = `${prodId}-IMG-${imageCount + 1}`;

    return this.prisma.productImage.create({
      data: {
        ...imageData,
        prodId,
        prodImageId: newImageId,
      },
    });
  }

  async removeMany(imageIds: string[]) {
    const imagesToDelete = await this.prisma.productImage.findMany({
      where: {
        prodImageId: {
          in: imageIds,
        },
      },
    });

    if (imagesToDelete.length === 0) {
      return;
    }

    const publicIds = imagesToDelete.map(img => img.prodImagePublicid);

    await Promise.all(publicIds.map(id => this.cloudinary.deleteImage(id)));

    await this.prisma.productImage.deleteMany({
      where: {
        prodImageId: {
          in: imageIds,
        },
      },
    });
  }

  async remove(id: string) {
    const productImage = await this.prisma.productImage.findUnique({
      where: { prodImageId: id },
    });

    if (!productImage) {
      throw new NotFoundException(`Imagen con ID "${id}" no encontrada.`);
    }

    await this.cloudinary.deleteImage(productImage.prodImagePublicid);

    return this.prisma.productImage.delete({
      where: { prodImageId: id },
    });
  }
}