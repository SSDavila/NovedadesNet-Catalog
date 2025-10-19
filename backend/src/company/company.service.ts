import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async find(): Promise<Company | null> {    
    return this.prisma.company.findUnique({
      where: { companyId: 1 },
    });
  }

  async upsert(updateCompanyDto: UpdateCompanyDto): Promise<Company> {

    try {
      const companyData = {
        companyName: updateCompanyDto.companyName ?? '',
        companyTradeName: updateCompanyDto.companyTradeName ?? '',
        companyRuc: updateCompanyDto.companyRuc ?? '',
        companyAddress: updateCompanyDto.companyAddress ?? '',
        sriEnvironment: String(updateCompanyDto.sriEnvironment ?? 1),
      };

      return await this.prisma.company.upsert({
        where: { companyId: 1 },
        update: companyData,
        create: { companyId: 1, ...companyData },
      });
    } catch (error) {
        throw new Error('No se pudo guardar la información de la empresa.');
    }
  }
}
