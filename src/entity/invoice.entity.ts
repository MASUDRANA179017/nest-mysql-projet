import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';
import { Store } from './store.entity';

export enum InvoiceStatus {
    PENDING = 'pending',
    PAID = 'paid',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    invoiceNumber: string;

    @ManyToOne(() => User, { eager: true })
    customer: User;

    @ManyToOne(() => Store, { eager: true })
    store: Store;

    @ManyToOne(() => Order, { eager: true, nullable: true })
    order: Order;

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    taxAmount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discountAmount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.PENDING })
    status: InvoiceStatus;

    @Column({ nullable: true })
    notes: string;

    @Column({ nullable: true, type: 'datetime' })
    dueDate: Date;

    @Column({ nullable: true, type: 'datetime' })
    paidAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}

