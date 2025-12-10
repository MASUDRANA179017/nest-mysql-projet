
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany } from "typeorm";
import { User } from "./user.entity";
import { Store } from "./store.entity";
import { Review } from "./review.entity";
import { Category } from "./category.entity";
import { Brand } from "./brand.entity";
import { WeightUnit } from "./weight-unit.entity";
import { Prescription } from "./prescription.entity";
import { Coupon } from "./coupon.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    stock: number;

    @Column({ nullable: true, type: 'datetime' })
    manufactureDate: Date;

    @Column({ nullable: true, type: 'datetime' })
    expireDate: Date;


    @Column({ nullable: true })
    productThumbnail: string;
    
    @Column("simple-array", { nullable: true })
    productGallery: string[];
    
    @ManyToOne(() => User, (user) => user.id)
    vendor: User;

    @ManyToMany(() => Coupon, (coupon) => coupon.id)
    coupons: Coupon[];
    
    @ManyToOne(() => Store, (store) => store.id)
    store: Store;
    
    @ManyToOne(() => WeightUnit, (weightUnit) => weightUnit.product)
    weightUnit: WeightUnit;

    @ManyToOne(() => Category, (category) => category.product)
    category: Category;
    
    @ManyToOne(() => Brand, (brand) => brand.product)
    brand: Brand;

    @ManyToOne(() => Prescription, (prescription) => prescription.products)
    prescription: Prescription[];
    
    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];


}
