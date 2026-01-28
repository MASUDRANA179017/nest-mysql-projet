import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeaturedOffer } from '../entities/featured-offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeaturedOffer])],
  exports: [TypeOrmModule],
})
export class FeaturedOffersModule {}
