import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    const { prodImages, ...productDetails } = createProductDto;

    if (!files || files.length === 0) {
      throw new Error('Se requieren imágenes para el producto.');
    }

    const product = await this.prisma.$transaction(async (prisma) => {
      const newProduct = await prisma.product.create({
        data: {
          ...productDetails,
          prodPrice: +productDetails.prodPrice,
          prodStock: +productDetails.prodStock,
        },
      });

      const imagesData = files.map((file) => ({
        prodImageUrl: `http://localhost:5000/static/uploads/${file.filename}`,
        prodId: newProduct.prodId,
      }));

      await prisma.productImage.createMany({
        data: imagesData,
      });

      return newProduct;
    });

    return this.findOne(product.prodId);
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        prodImages: {
          select: {
            prodImageUrl: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { prodId: id },
      include: {
        prodImages: {
          select: {
            prodImageId: true,
            prodImageUrl: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID '${id}' no encontrado.`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { imagesToDelete, prodImages, ...productDetails } = updateProductDto;
    await this.findOne(id);

    return this.prisma.product.update({
      where: { prodId: id },
      data: {
        ...productDetails,
        ...(productDetails.prodPrice && { prodPrice: +productDetails.prodPrice }),
        ...(productDetails.prodStock && { prodStock: +productDetails.prodStock }),
      },
    });
  }

  async uploadImages(id: string, files: Express.Multer.File[]) {
    await this.findOne(id);
    if (!files || files.length === 0) {
      throw new BadRequestException('No se proporcionaron imágenes para subir.');
    }
    const imagesData = files.map((file) => ({
      prodImageUrl: `http://localhost:5000/static/uploads/${file.filename}`,
      prodId: id,
    }));
    await this.prisma.productImage.createMany({
      data: imagesData,
    });
    return this.findOne(id);
  }

  async deleteImages(imageIds: number[]) {
    if (!imageIds || imageIds.length === 0) {
      throw new BadRequestException('No se proporcionaron IDs de imágenes.');
    }

    if (imageIds.some(id => typeof id !== 'number' || isNaN(id))) {
      throw new BadRequestException('Todos los IDs de imágenes deben ser números válidos.');
    }

    return this.prisma.$transaction(async (prisma) => {
      const imagesToDelete = await prisma.productImage.findMany({
        where: { prodImageId: { in: imageIds } },
      });

      for (const image of imagesToDelete) {
        try {
          if (image.prodImageUrl && image.prodImageUrl.startsWith('http')) {
            const url = new URL(image.prodImageUrl);
            const filename = path.basename(url.pathname);
            const imagePath = path.join(process.cwd(), 'static', 'uploads', filename);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          } else {
            console.warn(`URL de imagen no válida o vacía, omitiendo borrado de archivo: ${image.prodImageUrl}`);
          }
        } catch (error) {
          console.error(`Error al eliminar el archivo físico: ${image.prodImageUrl}`, error);
        }
      }

      const deleteResult = await prisma.productImage.deleteMany({
        where: { prodImageId: { in: imageIds } },
      });
      return { count: deleteResult.count };
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { prodId: id },
    });
  }
}