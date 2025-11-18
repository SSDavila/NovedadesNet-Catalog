import { Module } from '@nestjs/common';
import { SriController } from './sri.controller';
import { SriService } from './sri.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PrismaModule, 
    HttpModule,  
  ],
  controllers: [SriController],
  providers: [SriService],
  exports: [SriService], 
})
export class SriModule {}
