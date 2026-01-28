import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class InventoryLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  change: number;

  @Column()
  reason: string;

  @Column({ type: 'datetime' })
  createdAt: Date;
}
