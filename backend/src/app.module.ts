import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './product/products.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
  rootPath: join(process.cwd(), 'static', 'uploads'),
  serveRoot: '/static/uploads',
}),

    AuthModule,
    PrismaModule,
    CategoryModule,
    ProductsModule,
  ],
})
export class AppModule {}
