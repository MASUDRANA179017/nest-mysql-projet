import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferClick } from '../entities/offer-click.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OfferClick])],
  exports: [TypeOrmModule],
})
export class OfferClicksModule {}
