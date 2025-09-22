import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { categoryName } = createCategoryDto;

    const existingCategory = await this.prisma.category.findUnique({
      where: { categoryName },
    });

    if (existingCategory) {
      throw new ConflictException('La categoría ya existe.');
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  update(id: number, updateCategoryDto: CreateCategoryDto) {
    return this.prisma.category.update({
      where: { categoryId: id },
      data: updateCategoryDto,
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({
      where: { categoryId: id },
    });
  }
}