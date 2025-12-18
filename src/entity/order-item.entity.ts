import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;
  
  @Column()
  totalPrice: number;

  @Column({ type: 'datetime', nullable: true })
  serviceDate: Date | null;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
