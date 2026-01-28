import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entity/category.entity';
import { Merchant } from '../entity/merchant.entity';
import { Offer } from '../vendor-offers/entities/offer.entity';
import { SeederService } from './seeder.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Merchant, Offer])],
    providers: [SeederService],
})
export class SeederModule {}
