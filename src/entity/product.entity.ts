
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


    @Column({ default: false })
    isService: boolean;

    @Column({ default: true })
    isAvailable: boolean;

    @Column("simple-json", { nullable: true })
    schedule: any;

    @Column({ nullable: true })
    barcode: string;

    @Column({ nullable: true })
    productThumbnail: string;
    
    @Column("simple-array", { nullable: true })
    productGallery: string[];
    
    @ManyToOne(() => User)
    vendor: User;

    @ManyToMany(() => Coupon, (coupon) => coupon.products)
    coupons: Coupon[];
    
    @ManyToOne(() => Store)
    store: Store;
    
    @ManyToOne(() => WeightUnit, (weightUnit) => weightUnit.product, { nullable: true })
    weightUnit: WeightUnit | null;

    @ManyToOne(() => Category, (category) => category.product)
    category: Category;
    
    @ManyToOne(() => Brand, (brand) => brand.product, { nullable: true })
    brand: Brand | null;

    @ManyToMany(() => Prescription, (prescription) => prescription.products)
    prescription: Prescription[];
    
    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];


}
