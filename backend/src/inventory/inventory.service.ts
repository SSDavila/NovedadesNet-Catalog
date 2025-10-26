import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  findAllStock() {
    return this.prisma.product.findMany({
      select: {
        productId: true,
        productName: true,
        productSku: true,
        productStock: true,
        category: {
          select: {
            categoryName: true,
          },
        },
      },
      orderBy: {
        productName: 'asc',
      },
    });
  }

  findAllMovements() {
    return this.prisma.inventoryMovement.findMany({
      include: {
        product: {
          select: {
            productName: true,
            productSku: true,
          },
        },
        user: {
          select: {
            userName: true,
          },
        },
      },
      orderBy: {
        inventoryMovementCreatedAt: 'desc',
      },
    });
  }

  async adjustStock(items: AdjustStockDto[], userId: number) {
    return this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        const { productId, quantityChange, reason } = item;

        if (quantityChange === 0) continue;

        const product = await tx.product.findUnique({
          where: { productId },
        });

        if (!product) {
          throw new NotFoundException(`Producto con ID ${productId} no encontrado.`);
        }

        if (product.productStock + quantityChange < 0) {
          throw new BadRequestException(
            `Ajuste inválido para ${product.productName}. El stock no puede ser negativo.`,
          );
        }

        await tx.product.update({
          where: { productId },
          data: { productStock: { increment: quantityChange } },
        });

        await tx.inventoryMovement.create({
          data: {
            productId,
            userId,
            inventoryMovementType: 'MANUAL_ADJUSTMENT',
            inventoryMovementQuantity: quantityChange,
            inventoryMovementReason: reason,
          },
        });
      }
      return { message: 'Inventario ajustado con éxito.' };
    });
  }
}