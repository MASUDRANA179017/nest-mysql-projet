import { Module } from '@nestjs/common';
import { WeightUnitController } from './weight-unit.controller';
import { WeightUnitService } from './weight-unit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeightUnit } from 'src/entity/weight-unit.entity';
import { Product } from 'src/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WeightUnit, Product])],
  controllers: [WeightUnitController],
  providers: [WeightUnitService]
})
export class WeightUnitModule {}
