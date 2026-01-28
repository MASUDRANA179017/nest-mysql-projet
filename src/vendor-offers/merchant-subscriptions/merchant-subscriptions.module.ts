import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantSubscription } from '../entities/merchant-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantSubscription])],
  exports: [TypeOrmModule],
})
export class MerchantSubscriptionsModule {}
