import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
    const { prodImages, ...productDetails } = updateProductDto;
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

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { prodId: id },
    });
  }
}