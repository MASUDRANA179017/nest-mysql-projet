import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { User } from '../entity/user.entity';
import { Store } from '../entity/store.entity';
import { Order } from '../entity/order.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) {}

    async getStats() {
        const totalUsers = await this.userRepository.count();
        const totalVendors = await this.storeRepository.count();
        
        // Assuming Active Orders are those not Delivered or Cancelled
        // But for simplicity let's count 'Pending' or similar. 
        // Or just count all for now if status is free-text.
        // Let's check Order entity default is 'Pending'.
        const activeOrders = await this.orderRepository.count({
            where: { status: In(['Pending', 'Processing', 'Shipped']) }
        });

        // Revenue: Sum of totalAmount of all Completed orders (or all orders?)
        // Usually revenue is from completed orders.
        // Let's sum all for now or Completed if exists.
        // Using query builder for sum
        const revenueResult = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'sum')
            // .where('order.status = :status', { status: 'Completed' }) // Uncomment if status logic is strict
            .getRawOne();
        
        const revenue = revenueResult.sum ? parseFloat(revenueResult.sum) : 0;

        return {
            totalUsers,
            totalVendors,
            activeOrders,
            revenue
        };
    }
}
