import { Module } from '@nestjs/common';
import { PrescriptionController } from './prescription.controller';
import { PrescriptionService } from './prescription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from 'src/entity/prescription.entity';
import { User } from 'src/entity/user.entity';
import { Product } from 'src/entity/product.entity';
import { Store } from 'src/entity/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prescription, User, Product, Store])],
  controllers: [PrescriptionController],
  providers: [PrescriptionService]
})
export class PrescriptionModule {}
