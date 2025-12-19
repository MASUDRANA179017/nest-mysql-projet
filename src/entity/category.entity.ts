import { Coupon } from "./coupon.entity";
import { Product } from "./product.entity";
import { Store } from "./store.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description?: string;

    @OneToMany(() => Product, (product) => product.category)
    product: Product[];

    @OneToMany(() => Coupon, (coupons) => coupons.categories)
    coupons: Coupon[];

    @ManyToOne(() => Category, (category) => category.children, { nullable: true, onDelete: 'SET NULL' })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @OneToMany(() => Store, (store) => store.category)
    stores: Store[];

    @ManyToOne(() => Store, (store) => store.customCategories, { nullable: true, onDelete: 'CASCADE' })
    store: Store;
} 