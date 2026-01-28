import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  type: string;

  @Column('text')
  message: string;

  @Column()
  status: string;

  @Column({ type: 'datetime' })
  sentAt: Date;
}
