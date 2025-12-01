import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Store } from './store.entity';
import { PosSession } from './pos-session.entity';

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    MOBILE = 'mobile',
    MIXED = 'mixed',
}

export enum TransactionStatus {
    COMPLETED = 'completed',
    REFUNDED = 'refunded',
    VOIDED = 'voided',
}

@Entity()
export class PosTransaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    transactionNumber: string;

    @ManyToOne(() => Store, { eager: true })
    store: Store;

    @ManyToOne(() => User, { eager: true })
    cashier: User;

    @ManyToOne(() => User, { eager: true, nullable: true })
    customer: User;

    @ManyToOne(() => PosSession, (session) => session.transactions)
    session: PosSession;

    @Column('simple-json')
    items: PosTransactionItem[];

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    taxAmount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discountAmount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH })
    paymentMethod: PaymentMethod;

    @Column('decimal', { precision: 10, scale: 2 })
    amountPaid: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    changeAmount: number;

    @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.COMPLETED })
    status: TransactionStatus;

    @Column({ nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;
}

export interface PosTransactionItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

