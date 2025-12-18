
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Store } from "./store.entity";
import { Order } from "./order.entity";
import { Prescription } from "./prescription.entity";
import { WalletTransaction } from "./wallet-transaction.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })
    email: string;
    @Column()
    password: string;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column()
    username: string;
    @Column({ default: false })
    isActive: boolean;
    @Column({ type: 'varchar', default: 'user' })
    role: 'admin' | 'vendor' | 'user';

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    walletBalance: number;

    @Column({ type: 'int', nullable: true })
    referredByVendorId?: number;

    @Column({ nullable: true })
    refreshToken?: string;

    @Column({ nullable: true })
    profileImage?: string;

    @Column({ default: 0 })
    walletPoints: number;

    @ManyToMany(() => Store, (store) => store.followers)
    @JoinTable()
    followedStores: Store[];

    @OneToMany(() => Store, (store) => store.owner)
    stores: Store[];

    @OneToMany(() => Prescription, (prescription) => prescription.owner)
    prescription: Prescription[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => WalletTransaction, (transaction) => transaction.user)
    transactions: WalletTransaction[];
}
