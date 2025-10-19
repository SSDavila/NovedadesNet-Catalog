import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from '@prisma/client';
import { Express } from 'express';
import * as forge from 'node-forge';
import * as fs from 'fs';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async find(): Promise<Company | null> {    
    return this.prisma.company.findUnique({
      where: { companyId: 1 },
    });
  }

  async upsert(updateCompanyDto: UpdateCompanyDto, file?: Express.Multer.File): Promise<Company> {

    if (file && updateCompanyDto.sriPassword) {
      try {
        const p12Buffer = fs.readFileSync(file.path);
        const p12Asn1 = forge.asn1.fromDer(p12Buffer.toString('binary'));

        forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, updateCompanyDto.sriPassword);
      } catch (e) {

        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Error al eliminar el archivo .p12 inválido:', unlinkError);
        }

        throw new BadRequestException(
          'La contraseña de la firma electrónica es incorrecta. No se pudo validar el archivo .p12.',
        );
      }
    }

    try {
      const companyData: any = {
        companyName: updateCompanyDto.companyName ?? '',
        companyTradeName: updateCompanyDto.companyTradeName ?? '',
        companyRuc: updateCompanyDto.companyRuc ?? '',
        companyAddress: updateCompanyDto.companyAddress ?? '',
        sriEnvironment: String(updateCompanyDto.sriEnvironment ?? '1'),
        sriCertificatePassword: updateCompanyDto.sriPassword,
      };

      if (file) {
        companyData.sriCertificatePath = file.path;
      }

      return await this.prisma.company.upsert({
        where: { companyId: 1 },
        update: companyData,
        create: { companyId: 1, ...companyData },
      });
    } catch (error) {
      console.error("Error en upsert de empresa:", error);
        throw new Error('No se pudo guardar la información de la empresa.');
    }
  }
}
