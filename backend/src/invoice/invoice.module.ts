import { Module } from '@nestjs/common';
import { InvoicesService } from './invoice.service';
import { InvoicesController } from './invoice.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { SriModule } from 'src/sri/sri.module';
import { PdfModule } from 'src/pdf/pdf.module';

@Module({
  imports: [PrismaModule, AuthModule, SriModule, PdfModule],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}