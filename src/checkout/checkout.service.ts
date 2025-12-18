
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/entity/order-item.entity';
import { Order } from 'src/entity/order.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from 'src/entity/product.entity';

@Injectable()
export class CheckoutService {
    constructor(
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem) private itemRepository: Repository<OrderItem>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
    ) { }

    async createOrder(createOrderDto: CreateOrderDto, userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        if (!createOrderDto.items || createOrderDto.items.length === 0) {
            throw new ForbiddenException('Order items are required');
        }

        let totalAmount = 0;

        const orderItems: OrderItem[] = [];

        for (const item of createOrderDto.items) {
            const { productId, quantity } = item;

            const product = await this.productRepository.findOne({ where: { id: Number(productId) } });
            if (!product) throw new NotFoundException(`Product with ID ${productId} not found`);
            const productPrice = product.price;
            const totalPrice = productPrice * quantity;
            totalAmount += totalPrice;

            const orderItem = this.itemRepository.create({
                productId,
                quantity,
                totalPrice,
                serviceDate: item.serviceDate ? new Date(item.serviceDate) : undefined,
            });
               
            orderItems.push(orderItem);
        }


        const order = this.orderRepository.create({
            user,
            totalAmount,
            shippingAddress: createOrderDto.shippingAddress
        });

        const savedOrder = await this.orderRepository.save(order);

        // Link items to the order
        orderItems.forEach(item => item.order = savedOrder);
        await this.itemRepository.save(orderItems);

        return {
            message: 'Order placed successfully',
            order: savedOrder,
            items: orderItems,
        };
    }

    async getAllOrders(): Promise<Order[]> {
        return this.orderRepository.find({ relations: ['user', 'items'] });
    }

    async getVendorOrders(userId: number) {
        const orders = await this.orderRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('items.product', 'product')
            .leftJoinAndSelect('product.store', 'store')
            .leftJoinAndSelect('store.owner', 'owner')
            .leftJoinAndSelect('order.user', 'user')
            .where('owner.id = :userId', { userId })
            .orderBy('order.createdAt', 'DESC')
            .getMany();

        return orders.map(order => {
            const vendorItems = order.items.filter(item => item.product?.store?.owner?.id === userId);
            const vendorTotal = vendorItems.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);

            return {
                ...order,
                items: vendorItems,
                totalAmount: vendorTotal,
                originalTotalAmount: order.totalAmount
            };
        });
    }
}
