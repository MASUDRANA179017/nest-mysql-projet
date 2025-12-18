
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Coupon } from "./coupon.entity";
import { Prescription } from "./prescription.entity";

import { Category } from "./category.entity";

@Entity()
export class Store {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @ManyToOne(() => User, (user) => user.stores)
    owner: User;

    @OneToMany(() => Prescription, (prescriptions) => prescriptions.store)
    prescriptions: Prescription[];

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Coupon, (coupon) => coupon.store)
    coupons: Coupon[];

    @ManyToOne(() => Category, (category) => category.stores, { nullable: true })
    category: Category;
}