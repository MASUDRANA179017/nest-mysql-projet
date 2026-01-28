import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  type: string;

  @Column()
  targetId: number;

  @Column('text')
  comment: string;

  @Column()
  rating: number;

  @Column({ type: 'datetime' })
  createdAt: Date;
}
