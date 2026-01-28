import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferTemplate } from '../entities/offer-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OfferTemplate])],
  exports: [TypeOrmModule],
})
export class OfferTemplatesModule {}
