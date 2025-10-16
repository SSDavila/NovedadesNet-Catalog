import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './product/products.module';
import { AiController } from './ai/ai.controller';
import { UsersModule } from './user/users.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'static', 'uploads'),
      serveRoot: '/static/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),

    AuthModule,
    PrismaModule,
    CategoryModule,
    ProductsModule,
    UsersModule,

  ],
  controllers: [AiController]
})
export class AppModule {}
