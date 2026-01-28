import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferReport } from '../entities/offer-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OfferReport])],
  exports: [TypeOrmModule],
})
export class OfferReportsModule {}
