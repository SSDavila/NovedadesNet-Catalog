import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { userEmail: createUserDto.userEmail },
    });

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está en uso.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.userPassword, 10);

    const { userPassword, ...userData } = createUserDto;

    return this.prisma.user.create({
      data: {
        ...userData,
        userPassword: hashedPassword,
      },
      select: {
        userId: true,
        userEmail: true,
        userName: true,
        userRole: true,
        userIsActive: true,
        userCreatedAt: true,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        userId: true,
        userEmail: true,
        userName: true,
        userRole: true,
        userIsActive: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { userId: id },
      select: {
        userId: true,
        userEmail: true,
        userName: true,
        userRole: true,
        userIsActive: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.userPassword) {
      updateUserDto.userPassword = await bcrypt.hash(updateUserDto.userPassword, 10);
    }
    return this.prisma.user.update({
      where: { userId: id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Asegura que el usuario exista antes de borrar
    return this.prisma.user.delete({ where: { userId: id } });
  }
}