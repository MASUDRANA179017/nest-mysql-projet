import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class LoyaltyPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  points: number;

  @Column()
  reason: string;

  @Column({ type: 'datetime' })
  createdAt: Date;
}
