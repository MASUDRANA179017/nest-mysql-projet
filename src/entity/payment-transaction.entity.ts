import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class PaymentTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  orderId: number;

  @Column('decimal')
  amount: number;

  @Column()
  method: string;

  @Column()
  status: string;

  @Column()
  transactionRef: string;

  @Column({ type: 'datetime' })
  createdAt: Date;
}
