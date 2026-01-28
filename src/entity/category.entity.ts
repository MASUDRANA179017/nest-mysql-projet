import { Coupon } from "./coupon.entity";
import { Product } from "./product.entity";
import { Store } from "./store.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {
    
    @ApiProperty({ example: 1, description: 'The unique identifier of the category' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'Electronics', description: 'The name of the category' })
    @Column()
    name: string;

    @ApiProperty({ example: 'Category description', description: 'The description of the category', required: false })
    @Column()
    description?: string;

    @ApiProperty({ example: 'product', description: 'The type of the category' })
    @Column({ default: 'product' })
    type: string; // 'store' | 'product'

    @ApiProperty({ type: () => [Product], description: 'Products in this category' })
    @OneToMany(() => Product, (product) => product.category)
    product: Product[];

    @ApiProperty({ type: () => [Coupon], description: 'Coupons for this category' })
    @OneToMany(() => Coupon, (coupons) => coupons.categories)
    coupons: Coupon[];

    @ApiProperty({ type: () => Category, description: 'Parent category', required: false })
    @ManyToOne(() => Category, (category) => category.children, { nullable: true, onDelete: 'SET NULL' })
    parent: Category;

    @ApiProperty({ type: () => [Category], description: 'Child categories' })
    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @ApiProperty({ type: () => [Store], description: 'Stores in this category' })
    @OneToMany(() => Store, (store) => store.category)
    stores: Store[];

    // Removed reference to non-existent customCategories on Store
} 