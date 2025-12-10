import { Category } from './category.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { Store } from "./store.entity";
import { Product } from "./product.entity";

@Entity()
export class Coupon {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column({ type: 'enum', enum: ['FIXED', 'PERCENTAGE'], default: 'PERCENTAGE' })
    discountType: 'FIXED' | 'PERCENTAGE';

    @Column('decimal')
    discountValue: number;

    @Column({ type: 'enum', enum: ['PRODUCT', 'CATEGORY', 'FLAT'], default: 'PRODUCT' })
    scope: 'PRODUCT' | 'CATEGORY' | 'FLAT';

    @ManyToMany(() => Product, (product) => product.coupons, { nullable: true })
    @JoinTable()
    products?: Product[];

    @ManyToMany(() => Category, (category) => category.coupons, { nullable: true })
    @JoinTable()
    categories?: Category[];

    @ManyToOne(() => Store, (store) => store.coupons)
    store: Store;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt?: Date;

    @CreateDateColumn()
    createdAt: Date;
}
