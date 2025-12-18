
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/entity/order-item.entity';
import { Order } from 'src/entity/order.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from 'src/entity/product.entity';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class CheckoutService {
    constructor(
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem) private itemRepository: Repository<OrderItem>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        private storeService: StoreService,
    ) { }

    async createOrder(createOrderDto: CreateOrderDto, userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        if (!createOrderDto.items || createOrderDto.items.length === 0) {
            throw new ForbiddenException('Order items are required');
        }

        let totalAmount = 0;

        const orderItems: OrderItem[] = [];
        const storeGroups: Record<number, { store: any, items: any[] }> = {};

        for (const item of createOrderDto.items) {
            const { productId, quantity } = item;

            const product = await this.productRepository.findOne({ where: { id: Number(productId) }, relations: ['store', 'store.owner'] });
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

            // Group for email
            if (product.store) {
                 if (!storeGroups[product.store.id]) {
                     storeGroups[product.store.id] = { store: product.store, items: [] };
                 }
                 storeGroups[product.store.id].items.push({ name: product.name, quantity, price: totalPrice });
            }
        }


        const order = this.orderRepository.create({
            user,
            totalAmount,
            shippingAddress: createOrderDto.shippingAddress,
            customerName: createOrderDto.customerName,
            customerPhone: createOrderDto.customerPhone,
            notes: createOrderDto.notes,
        });

        const savedOrder = await this.orderRepository.save(order);

        // Link items to the order
        orderItems.forEach(item => item.order = savedOrder);
        await this.itemRepository.save(orderItems);

        // Send Emails (Async)
        this.sendOrderEmails(storeGroups, user).catch(err => console.error("Failed to send order emails", err));

        return {
            message: 'Order placed successfully',
            order: savedOrder,
            items: orderItems,
        };
    }

    private async sendOrderEmails(storeGroups: any, user: User) {
        for (const storeId in storeGroups) {
            const group = storeGroups[storeId];
            const store = group.store;
            const itemsList = group.items.map(i => `- ${i.name} (x${i.quantity}): ${i.price}`).join('\n');
            
            // Customer Email
            try {
                await this.storeService.sendStoreEmailInternal(
                    store.id,
                    user.email,
                    `Order Confirmation - ${store.name}`,
                    `Hello ${user.firstName},\n\nThank you for your order from ${store.name}.\n\nItems:\n${itemsList}\n\nTotal: ${group.items.reduce((s, i) => s + i.price, 0)}\n\nBest regards,\n${store.name}`
                );
            } catch (e) { console.error(`Failed to send customer email for store ${store.id}`, e); }

            // Vendor Email
             try {
                if (store.owner && store.owner.email) {
                    await this.storeService.sendStoreEmailInternal(
                        store.id,
                        store.owner.email,
                        `New Order Received - ${store.name}`,
                        `Hello ${store.owner.firstName},\n\nYou have a new order from ${user.firstName} ${user.lastName} (${user.email}).\n\nItems:\n${itemsList}\n\nPlease check your dashboard for details.`
                    );
                }
            } catch (e) { console.error(`Failed to send vendor email for store ${store.id}`, e); }
        }
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

    async updateOrderStatus(orderId: number, status: string) {
        console.log(`[Service] Finding order ${orderId}...`);
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) {
            console.error(`[Service] Order ${orderId} not found`);
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
        console.log(`[Service] Current status: ${order.status}. New status: ${status}`);
        order.status = status;
        const savedOrder = await this.orderRepository.save(order);
        console.log(`[Service] Order saved. Status is now: ${savedOrder.status}`);
        return savedOrder;
    }
}
