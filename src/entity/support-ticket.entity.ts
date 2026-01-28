import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SupportTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  subject: string;

  @Column('text')
  description: string;

  @Column()
  status: string;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  closedAt: Date;
}
