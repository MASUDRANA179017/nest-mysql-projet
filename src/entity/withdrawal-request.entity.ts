import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'processed';

@Entity()
export class WithdrawalRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected', 'processed'], default: 'pending' })
  status: WithdrawalStatus;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.transactions, { eager: true })
  user: User;
}

