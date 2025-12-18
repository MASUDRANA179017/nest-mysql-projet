import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../entity/user.entity';
import { Store } from '../entity/store.entity';
import { Order } from '../entity/order.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Store, Order])],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}
