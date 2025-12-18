import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column()
  totalAmount: number;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  customerPhone: string;

  @Column({ nullable: true })
  notes: string;

  @Column()
  shippingAddress: string;

  @Column({ default: 'Pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
