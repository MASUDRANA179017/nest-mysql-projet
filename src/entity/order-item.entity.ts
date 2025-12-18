import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  quantity: number;
  
  @Column()
  totalPrice: number;

  @Column({ type: 'datetime', nullable: true })
  serviceDate: Date | null;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
