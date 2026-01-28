import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Store } from './store.entity';
import { Merchant } from '../vendor-offers/entities/merchant.entity';

@Entity()
export class Prescription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
    
    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    note?: string;

    @Column({ nullable: true })
    advice?: string;

    @Column({ nullable: true, type: 'datetime' })
    visitingDate: Date;

    @Column({ nullable: true, type: 'datetime' })
    nextVisitingDate: Date;

    @ManyToOne(() => Store, (store) => store.prescriptions)
    store: Store;

    @ManyToOne(() => User, (user) => user.prescription)
    owner: User;


    @ManyToMany(() => Product, (product)=> product.prescription)
    @JoinTable() 
    products: Product[];

    // Relations
    @ManyToOne(() => Merchant, { nullable: false })
    merchant: Merchant;
}
