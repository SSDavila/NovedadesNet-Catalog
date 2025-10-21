import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.$transaction(async (tx) => {
      const customerCount = await tx.customer.count();
      const nextIdNumber = customerCount + 1;
      const newCustomerId = `CLI-${nextIdNumber}`;

      try {
        const newCustomer = await tx.customer.create({
          data: {
            ...createCustomerDto,
            customerId: newCustomerId,
          },
        });
        return newCustomer;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(
            'Ya existe un cliente con ese número de identificación.',
          );
        }
        throw error;
      }
    });
  }

  findAll() {
    return this.prisma.customer.findMany({
      orderBy: {
        customerName: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { customerId: id },
    });
    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado.`);
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id); 
    return this.prisma.customer.update({
      where: { customerId: id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.customer.delete({ where: { customerId: id } });
  }
}