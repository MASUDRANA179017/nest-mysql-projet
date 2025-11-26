import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Store } from "./store.entity";
import { Review } from "./review.entity";
import { Category } from "./category.entity";
import { Brand } from "./brand.entity";
import { WeightUnit } from "./weight-unit.entity";

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
    
    @ManyToOne(() => Store, (store) => store.id)
    store: Store;
    
    @ManyToOne(() => WeightUnit, (weightUnit) => weightUnit.products)
    weightUnit: WeightUnit;

    @ManyToOne(() => Category, (category) => category.product)
    category: Category;
    
    @ManyToOne(() => Brand, (brand) => brand.product)
    brand: Brand;
    
    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];

}
