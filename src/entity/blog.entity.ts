import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { User } from "./user.entity";
import { Merchant } from './merchant.entity';

@Entity()
export class Blog {
  @ApiProperty({ example: 1, description: 'The unique identifier of the blog' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'My Blog Title', description: 'The title of the blog' })
  @Column()
  title: string;

  @ApiProperty({ example: 'Blog content...', description: 'The content of the blog' })
  @Column({ type: "text" })
  content: string;

  @ApiProperty({ example: 'image.jpg', description: 'The image URL of the blog', required: false })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ description: 'The vendor (user) who created the blog' })
  @ManyToOne(() => User)
  vendor: User;

  @ApiProperty({ description: 'The merchant associated with the blog' })
  @ManyToOne(() => Merchant, { nullable: false })
  merchant: Merchant;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The creation date' })
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The last update date' })
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
