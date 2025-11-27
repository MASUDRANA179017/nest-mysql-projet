import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/entity/product.entity";
import { User } from "src/entity/user.entity";
import { Store } from "src/entity/store.entity";
import { Category } from "src/entity/category.entity";
import { ImageService } from '../image/image.service'; 
import { WeightUnit } from "src/entity/weight-unit.entity";
import { Brand } from "src/entity/brand.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product, User, Store, WeightUnit, Category,Brand])],
  controllers: [ProductController],
  providers: [ProductService, ImageService]
})
export class ProductModule {}
