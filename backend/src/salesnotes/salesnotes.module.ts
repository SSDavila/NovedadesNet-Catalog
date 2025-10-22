import { Module } from '@nestjs/common';
import { SaleNotesService } from './salesnotes.service';
import { SaleNotesController } from './salesnotes.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SaleNotesController],
  providers: [SaleNotesService],
})
export class SaleNotesModule {}