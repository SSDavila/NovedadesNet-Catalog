import { Module } from '@nestjs/common';
import { BIDashboardController } from './bi-dashboard.controller';
import { BIDashboardService } from './bi-dashboard.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BIDashboardController],
  providers: [BIDashboardService],
})
export class BIDashboardModule {}
