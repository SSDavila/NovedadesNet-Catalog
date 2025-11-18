import { Module } from '@nestjs/common';
import { InvoicesService } from './invoice.service';
import { InvoicesController } from './invoice.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { EmailModule } from 'src/email/email.module';
import { SriModule } from 'src/sri/sri.module'; 

@Module({
  imports: [
    PrismaModule,
    PdfModule,
    EmailModule,
    SriModule, 
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}