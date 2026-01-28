import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferBookmark } from '../entities/offer-bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OfferBookmark])],
  exports: [TypeOrmModule],
})
export class OfferBookmarksModule {}
