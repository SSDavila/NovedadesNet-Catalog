import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSaleNoteDto } from './dto/create-salesnotes.dto';
import { UpdateSaleNoteDto } from './dto/update-salesnotes.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SaleNotesService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleNoteDto: CreateSaleNoteDto, sellerId: number) {
    const { customerId, items } = createSaleNoteDto;

    return this.prisma.$transaction(async (prisma) => {

        const customer = await prisma.customer.findUnique({
        where: { customerId },
      });
      if (!customer) {
        throw new NotFoundException(`Cliente con ID ${customerId} no encontrado.`);
      }

      const seller = await prisma.user.findUnique({
        where: { userId: sellerId },
      });
      if (!seller) {
        throw new NotFoundException(`Vendedor con ID ${sellerId} no encontrado.`);
      }

      const productIds = items.map((item) => item.productId);
      const products = await prisma.product.findMany({
        where: { productId: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new NotFoundException('Uno o más productos no fueron encontrados.');
      }

      let total = 0;
      const saleNoteItemsData = [];

      for (const item of items) {
        const product = products.find((p) => p.productId === item.productId);
        if (product.productStock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para el producto: ${product.productName}. Stock actual: ${product.productStock}`,
          );
        }
        const subtotal = product.productPrice.toNumber() * item.quantity;
        total += subtotal;

        saleNoteItemsData.push({
          productId: item.productId,
          saleNoteItemQuantity: item.quantity,
          saleNoteItemUnitPrice: product.productPrice,
          saleNoteItemSubtotal: subtotal,
        });
      }

      const sequence = await prisma.sequenceControl.upsert({
        where: {
          documentType_establishmentCode_emissionPointCode: {
            documentType: 'SALE_NOTE',
            establishmentCode: '001',
            emissionPointCode: '001',
          },
        },
        update: { currentNumber: { increment: 1 } },
        create: {
          documentType: 'SALE_NOTE',
          currentNumber: 1,
          establishmentCode: '001',
          emissionPointCode: '001',
        },
      });

      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const datePart = `${year}${month}${day}`;

      const saleNoteNumber = `NS-${datePart}-${sequence.currentNumber
        .toString()
        .padStart(6, '0')}`;

      const saleNote = await prisma.saleNote.create({
        data: {
          saleNoteNumber,
          saleNoteTotal: total,
          customerId,
          sellerId,
          items: {
            create: saleNoteItemsData,
          },
        },
      });

      for (const item of items) {
        await prisma.product.update({
          where: { productId: item.productId },
          data: { productStock: { decrement: item.quantity } },
        });
      }

      return saleNote;
    });
  }

  findAll() {
    return this.prisma.saleNote.findMany({
      include: { customer: true, seller: true },
      orderBy: {
        saleNoteCreatedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const saleNote = await this.prisma.saleNote.findUnique({
      where: { saleNoteId: id },
      include: {
        items: { include: { product: true } },
        customer: true,
        seller: { select: { userId: true, userName: true } },
      },
    });
    if (!saleNote) {
      throw new NotFoundException(`Nota de venta con ID ${id} no encontrada.`);
    }
    return saleNote;
  }

  async update(id: number, updateSaleNoteDto: UpdateSaleNoteDto) {
    await this.findOne(id);
    return this.prisma.saleNote.update({
      where: { saleNoteId: id },
      data: {
        saleNoteStatus: updateSaleNoteDto.saleNoteStatus,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    
    return this.prisma.saleNote.delete({
      where: { saleNoteId: id },
    });
  }
}
