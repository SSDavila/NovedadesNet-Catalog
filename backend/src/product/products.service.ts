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
    const { imagesToDelete, ...productDetails } = createProductDto;

    if (!productDetails.categoryId) {
      throw new BadRequestException(
        'La categoría del producto es requerida para generar un ID.',
      );
    }

    const uploadedImages: {
      secure_url: string;
      public_id: string;
    }[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await this.cloudinary.uploadFile(file);
        if ('error' in uploadResult) {
          throw new BadRequestException(`Error al subir la imagen ${file.originalname}: ${uploadResult.error.message}`);
        }
        uploadedImages.push(uploadResult);
      }
    }

    const newProduct = await this.prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { categoryId: productDetails.categoryId },
      });

      const categoryAbbreviation = category?.categoryAbbreviation;

      if (!category || !categoryAbbreviation) {
        throw new NotFoundException(
          `La categoría '${productDetails.categoryId}' no fue encontrada o no tiene una abreviación.`,
        );
      }

      const productCount = await tx.product.count({
        where: { categoryId: productDetails.categoryId },
      });
      const nextIdNumber = productCount + 1;

      const newProductId = `pt-${categoryAbbreviation}-${nextIdNumber}`;

      const imageUrls = uploadedImages.map((upload, index) => {
        return {
          productImageId: `${newProductId}-IMG-${index + 1}`,
          productImageUrl: upload.secure_url,
          productImagePublicId: upload.public_id,
        };
      });

      const createdProduct = await tx.product.create({
        data: {
          ...productDetails,
          productId: newProductId,
          productPrice: +productDetails.productPrice,
          productStock: +productDetails.productStock,
          images: { create: imageUrls },
          productPreviousPrice: productDetails.productPreviousPrice
            ? +productDetails.productPreviousPrice
            : undefined,
        },
      });

      return createdProduct;
    });

    return newProduct;
  }

  findAll(searchTerm?: string) {
    const includeRelations = {
      images: true,
      category: true,
    };

    if (searchTerm) {
      return this.prisma.product.findMany({
        where: {
          OR: [
            {
              productName: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              productSku: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: includeRelations,
      });
    }

    return this.prisma.product.findMany({
      include: includeRelations,
    });
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { productId: id },
      include: { images: true },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { imagesToDelete, ...productDetails } = updateProductDto;

    const dataToUpdate: any = { ...productDetails };

    if (productDetails.productPrice) {
      const currentProduct = await this.findOne(id);
      if (
        currentProduct &&
        +productDetails.productPrice !== currentProduct.productPrice.toNumber()
      ) {
        dataToUpdate.productPreviousPrice = currentProduct.productPrice;
      }
    }

    if (imagesToDelete && imagesToDelete.length > 0) {

      const deletePromises = imagesToDelete.map((public_id) =>
        this.cloudinary.deleteImage(public_id),
      );
      await Promise.all(deletePromises);

      await this.prisma.productImage.deleteMany({
        where: { productImagePublicId: { in: imagesToDelete as string[] } },
      });
    }

    return this.prisma.product.update({
      where: { productId: id },
      data: dataToUpdate,
    });
  }

  async uploadImages(id: string, files: Express.Multer.File[]) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID '${id}' no encontrado.`);
    }

    const highestImageNumber = product.images.reduce((max, image) => {
      const match = image.productImageId.match(/-IMG-(\d+)$/);
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
        productImageId: `${id}-IMG-${imageNumber}`,
        productImageUrl: result.secure_url,
        productImagePublicId: result.public_id,
        productId: id,
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
      where: { productId: id },
      include: { images: true }, 
    });

    if (deletedProduct.images && deletedProduct.images.length > 0) {
      const deletePromises = deletedProduct.images.map((image) =>
        this.cloudinary.deleteImage(image.productImagePublicId),
      );
      await Promise.all(deletePromises);
    }

    return { message: `Producto '${deletedProduct.productName}' y sus imágenes han sido eliminados.` };
  }
}
