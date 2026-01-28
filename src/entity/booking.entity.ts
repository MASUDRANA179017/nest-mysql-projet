import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  service: string;

  @Column({ type: 'datetime' })
  bookingDate: Date;

  @Column()
  status: string;

  @Column({ type: 'datetime' })
  createdAt: Date;
}
