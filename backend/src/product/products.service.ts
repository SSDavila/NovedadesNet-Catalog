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
          productOfferPrice: productDetails.productOfferPrice
            ? +productDetails.productOfferPrice
            : undefined,
          productCost: productDetails.productCost
            ? +productDetails.productCost
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
          productIsActive: true,
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
      where: { productIsActive: true },
      include: includeRelations,
    });
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { productId: id },
      include: { images: true },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files: Express.Multer.File[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const { imagesToDelete, ...productDetails } = updateProductDto;
      const dataToUpdate: any = { ...productDetails };

      // 1. Convertir campos numéricos de string a number
      if (dataToUpdate.productPrice) dataToUpdate.productPrice = +dataToUpdate.productPrice;
      if (dataToUpdate.productOfferPrice) dataToUpdate.productOfferPrice = +dataToUpdate.productOfferPrice;
      if (dataToUpdate.productCost) dataToUpdate.productCost = +dataToUpdate.productCost;
      if (dataToUpdate.productStock) dataToUpdate.productStock = +dataToUpdate.productStock;

      // 2. Eliminar imágenes marcadas para borrado
      if (imagesToDelete && imagesToDelete.length > 0) {
        const publicIds = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
        await tx.productImage.deleteMany({
          where: { productImagePublicId: { in: publicIds } },
        });
        const deletePromises = publicIds.map((publicId) => this.cloudinary.deleteImage(publicId));
        await Promise.all(deletePromises);
      }

      // 3. Subir nuevas imágenes y prepararlas para la base de datos
      if (files && files.length > 0) {
        const uploadedImages = await Promise.all(
          files.map((file) => this.cloudinary.uploadFile(file)),
        );

        const highestImage = await tx.productImage.findFirst({
          where: { productId: id },
          orderBy: { productImageId: 'desc' },
        });

        let nextImageNumber = 1;
        if (highestImage) {
          const match = highestImage.productImageId.match(/-IMG-(\d+)$/);
          if (match) {
            nextImageNumber = parseInt(match[1], 10) + 1;
          }
        }

        const newImagesData = uploadedImages.map((upload, index) => ({
          productImageId: `${id}-IMG-${nextImageNumber + index}`,
          productImageUrl: upload.secure_url,
          productImagePublicId: upload.public_id,
        }));

        dataToUpdate.images = {
          create: newImagesData,
        };
      }

      // 4. Actualizar el producto en la base de datos
      return tx.product.update({
        where: { productId: id },
        data: dataToUpdate,
      });
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

    const deletedProduct = await this.prisma.product.update({
      where: { productId: id },
      data: { productIsActive: false },
    });

    return { message: `Producto '${deletedProduct.productName}' ha sido eliminado (soft delete).` };
  }
}
