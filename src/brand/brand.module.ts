import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { Brand } from 'src/entity/brand.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Brand, Product])],
  controllers: [BrandController],
  providers: [BrandService]
})
export class BrandModule {}
