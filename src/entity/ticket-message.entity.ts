import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TicketMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticketId: number;

  @Column()
  senderId: number;

  @Column('text')
  message: string;

  @Column({ type: 'datetime' })
  sentAt: Date;
}
