import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Store } from './store.entity';
import { PosTransaction } from './pos-transaction.entity';

export enum SessionStatus {
    OPEN = 'open',
    CLOSED = 'closed',
}

@Entity()
export class PosSession {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Store, { eager: true })
    store: Store;

    @ManyToOne(() => User, { eager: true })
    cashier: User;

    @Column('decimal', { precision: 10, scale: 2 })
    openingBalance: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    closingBalance: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    totalSales: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    totalCashSales: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    totalCardSales: number;

    @Column({ default: 0 })
    transactionCount: number;

    @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.OPEN })
    status: SessionStatus;

    @Column({ nullable: true })
    closingNotes: string;

    @CreateDateColumn()
    openedAt: Date;

    @Column({ nullable: true, type: 'datetime' })
    closedAt: Date;

    @OneToMany(() => PosTransaction, (transaction) => transaction.session)
    transactions: PosTransaction[];
}

