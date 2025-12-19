import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { Product } from 'src/entity/product.entity';
import { Store } from 'src/entity/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, Store])],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
