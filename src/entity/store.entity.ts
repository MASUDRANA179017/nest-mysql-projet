
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
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
    coverImage: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;
    
    @Column({ nullable: true })
    smtpHost?: string;
    
    @Column({ nullable: true, type: 'int' })
    smtpPort?: number;
    
    @Column({ nullable: true })
    smtpUser?: string;
    
    @Column({ nullable: true })
    smtpPass?: string;
    
    @Column({ nullable: true, type: 'boolean' })
    smtpSecure?: boolean;
    
    @Column({ nullable: true })
    smtpFrom?: string;

    @ManyToOne(() => User, (user) => user.stores)
    owner: User;

    @ManyToMany(() => User, (user) => user.followedStores)
    followers: User[];

    @OneToMany(() => Prescription, (prescriptions) => prescriptions.store)
    prescriptions: Prescription[];

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Coupon, (coupon) => coupon.store)
    coupons: Coupon[];

    @ManyToOne(() => Category, (category) => category.stores, { nullable: true })
    category: Category;

    @OneToMany(() => Category, (category) => category.store)
    customCategories: Category[];
}
