import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AnalyticsReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column('text')
  data: string;

  @Column({ type: 'datetime' })
  generatedAt: Date;
}
