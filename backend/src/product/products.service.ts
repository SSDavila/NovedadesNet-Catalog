import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    const { prodCategory, prodImages, imagesToDelete, ...productDetails } =
      createProductDto;

    if (!prodCategory) {
      throw new BadRequestException(
        'La categoría del producto es requerida para generar un ID.',
      );
    }

    const newProduct = await this.prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { categoryName: prodCategory },
      });

      const categoryAbbreviation = category?.categoryAbbreviation;

      if (!category || !categoryAbbreviation) {
        throw new NotFoundException(
          `La categoría '${prodCategory}' no fue encontrada o no tiene una abreviación.`,
        );
      }

      const productCount = await tx.product.count({
        where: { prodCategory },
      });
      const nextIdNumber = productCount + 1;

      const newProdId = `pt-${categoryAbbreviation}-${nextIdNumber}`;

      const imageUrls: {
        prodImageId: string;
        prodImageUrl: string;
        prodImagePublicid: string;
      }[] = [];
      if (files && files.length > 0) {
        for (const [index, file] of files.entries()) {
          const { secure_url, public_id } = await this.cloudinary.uploadFile(
            file,
          );
          imageUrls.push({
            prodImageId: `${newProdId}-IMG-${index + 1}`,
            prodImageUrl: secure_url,
            prodImagePublicid: public_id,
          });
        }
      }

      const createdProduct = await tx.product.create({
        data: {
          ...productDetails,
          prodId: newProdId,
          prodCategory: prodCategory,
          prodPrice: +productDetails.prodPrice,
          prodStock: +productDetails.prodStock,
          prodImages: { create: imageUrls },
          prodPreviousPrice: productDetails.prodPreviousPrice
            ? +productDetails.prodPreviousPrice
            : undefined,
        },
      });

      return createdProduct;
    });

    return newProduct;
  }

  findAll() {
    return this.prisma.product.findMany({
      include: { prodImages: true },
    });
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { prodId: id },
      include: { prodImages: true },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { prodCategory, prodImages, imagesToDelete, ...productDetails } =
      updateProductDto;

    const dataToUpdate: any = { ...productDetails };

    if (productDetails.prodPrice) {
      const currentProduct = await this.findOne(id);
      if (
        currentProduct &&
        +productDetails.prodPrice !== currentProduct.prodPrice.toNumber()
      ) {
        dataToUpdate.prodPreviousPrice = currentProduct.prodPrice.toNumber();
      }
    }

    if (imagesToDelete && imagesToDelete.length > 0) {

      const deletePromises = imagesToDelete.map((public_id) =>
        this.cloudinary.deleteImage(public_id),
      );
      await Promise.all(deletePromises);

      await this.prisma.productImage.deleteMany({
        where: { prodImagePublicid: { in: imagesToDelete as string[] } },
      });
    }

    return this.prisma.product.update({
      where: { prodId: id },
      data: dataToUpdate,
    });
  }

  async uploadImages(id: string, files: Express.Multer.File[]) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID '${id}' no encontrado.`);
    }

    const highestImageNumber = product.prodImages.reduce((max, image) => {
      const match = image.prodImageId.match(/-IMG-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        return Math.max(max, num);
      }
      return max;
    }, 0);

    const uploadPromises = files.map((file) => this.cloudinary.uploadFile(file));
    const uploadResults = await Promise.all(uploadPromises);

    const newImagesData = uploadResults.map((result, index) => {
      const imageNumber = highestImageNumber + index + 1;
      return {
        prodImageId: `${id}-IMG-${imageNumber}`,
        prodImageUrl: result.secure_url,
        prodImagePublicid: result.public_id,
        prodId: id,
      };
    });

    await this.prisma.productImage.createMany({ data: newImagesData });
    return this.findOne(id);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID '${id}' no encontrado.`);
    }

    const deletedProduct = await this.prisma.product.delete({
      where: { prodId: id },
      include: { prodImages: true }, 
    });

    if (deletedProduct.prodImages && deletedProduct.prodImages.length > 0) {
      const deletePromises = deletedProduct.prodImages.map((image) =>
        this.cloudinary.deleteImage(image.prodImagePublicid),
      );
      await Promise.all(deletePromises);
    }

    return { message: `Producto '${deletedProduct.prodName}' y sus imágenes han sido eliminados.` };
  }
}
