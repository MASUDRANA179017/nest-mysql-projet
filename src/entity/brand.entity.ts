import { Product } from "./product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Brand {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description?: string;

    @Column({ nullable: true })
    brandThumbnail: string;

    @OneToMany(() => Product, (product) => product.brand)
    product: Product[];
} 