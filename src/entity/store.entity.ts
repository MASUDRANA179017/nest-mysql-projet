
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { User } from "./user.entity";
import { Coupon } from "./coupon.entity";
import { Prescription } from "./prescription.entity";
import { Merchant } from '../vendor-offers/entities/merchant.entity';
import { Category } from "./category.entity";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Store {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    // ...existing code...

    @Column()
        @ApiProperty({ example: 'Store Name', description: 'The name of the store' })
        @Column({ unique: true })
    @ApiProperty({ example: 'Store Name', description: 'The name of the store' })
    @Column({ unique: true })
    name: string;

    @ApiProperty({ example: 'Store description', description: 'The description of the store', required: false })
    @Column()
    description: string;

    @ApiProperty({ example: 'http://example.com/image.jpg', description: 'The URL of the store image', required: false })
    @Column({ nullable: true })
    imageUrl: string;

    @ApiProperty({ example: 'http://example.com/cover.jpg', description: 'The URL of the store cover image', required: false })
    @Column({ nullable: true })
    coverImage: string;

    @ApiProperty({ example: '123 Main St', description: 'The address of the store', required: false })
    @Column({ nullable: true })
    address: string;

    @ApiProperty({ example: 'New York', description: 'The city where the store is located', required: false })
    @Column({ nullable: true })
    city: string;

    @ApiProperty({ example: 'smtp.example.com', description: 'SMTP host for email notifications', required: false })
    @Column({ nullable: true })
    smtpHost?: string;

    @ApiProperty({ example: 587, description: 'SMTP port for email notifications', required: false })
    @Column({ nullable: true, type: 'int' })
    smtpPort?: number;

    @ApiProperty({ example: 'user@example.com', description: 'SMTP user for email notifications', required: false })
    @Column({ nullable: true })
    smtpUser?: string;

    @ApiProperty({ example: 'password', description: 'SMTP password for email notifications', required: false })
    @Column({ nullable: true })
    smtpPass?: string;

    @ApiProperty({ example: true, description: 'Whether to use a secure SMTP connection', required: false })
    @Column({ nullable: true, type: 'boolean' })
    smtpSecure?: boolean;

    @ApiProperty({ example: 'noreply@example.com', description: 'Email address for sending notifications', required: false })
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

    @ApiProperty({ type: () => Category, description: 'Category of the store' })
    @ManyToOne(() => Category, (category) => category.stores, { nullable: true })
    category: Category;

    @ApiProperty({ type: () => Merchant, description: 'Merchant of the store' })
    @ManyToOne(() => Merchant, { nullable: false })
    merchant: Merchant;
}
