import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.$transaction(async (tx) => {
      // Buscamos todos los IDs para encontrar el primer hueco disponible
      const allCustomers = await tx.customer.findMany({
        select: { customerId: true },
      });

      const existingIds = new Set<number>();
      for (const customer of allCustomers) {
        const parts = customer.customerId.split('-');
        if (parts.length === 2) {
          const num = parseInt(parts[1], 10);
          if (!isNaN(num)) {
            existingIds.add(num);
          }
        }
      }

      // Buscamos el primer número (empezando desde 1) que NO esté en uso
      let nextId = 1;
      while (existingIds.has(nextId)) {
        nextId++;
      }

      const newCustomerId = `CLI-${nextId}`;

      try {
        const newCustomer = await tx.customer.create({
          data: {
            ...createCustomerDto,
            customerId: newCustomerId,
          },
        });
        return newCustomer;
      } catch (error) {
        // Usamos un tipo genérico para evitar errores de importación con los tipos de Prisma
        const prismaError = error as { code?: string; meta?: { target?: string[] } };
        
        if (prismaError.code === 'P2002') {
          // Verificamos si el error viene del ID generado o de un dato del usuario (RUC/Email)
          const target = prismaError.meta?.target;
          
          if (target && target.includes('customerId')) {
            throw new InternalServerErrorException(
              'Error al generar ID. Por favor intente nuevamente.',
            );
          }

          throw new ConflictException(
            'Ya existe un cliente con ese número de identificación o correo electrónico.',
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