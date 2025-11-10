import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  private async generateNextId(): Promise<string> {
    const allCategories = await this.prisma.category.findMany({
      select: { categoryId: true },
    });

    if (allCategories.length === 0) {
      return 'CTGR-1';
    }

    const maxId = allCategories.reduce((max, cat) => {
      const currentNum = parseInt(cat.categoryId.split('-')[1], 10);
      return currentNum > max ? currentNum : max;
    }, 0);

    return `CTGR-${maxId + 1}`;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { categoryName, categoryAbbreviation } = createCategoryDto;

    const existingCategory = await this.prisma.category.findFirst({
      where: {
        OR: [
          { categoryName },
          ...(categoryAbbreviation ? [{ categoryAbbreviation }] : []),
        ],
      },
    });

    if (existingCategory) {
      throw new ConflictException(
        'Ya existe una categoría con ese nombre o abreviatura.',
      );
    }

    const newId = await this.generateNextId();
    return this.prisma.category.create({
      data: {
        categoryId: newId,
        ...createCategoryDto,
      },
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { categoryName: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { categoryId: id } });
    if (!category) {
      throw new NotFoundException(`Categoría con ID "${id}" no encontrada.`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({
      where: { categoryId: id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const productsCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      throw new ConflictException(
        `Esta categoría no se puede eliminar porque está siendo utilizada por ${productsCount} producto(s).`,
      );
    }

    return this.prisma.category.delete({
      where: { categoryId: id },
    });
  }
}