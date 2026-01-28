import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('festivals')
export class Festival {
  @ApiProperty({ example: 1, description: 'The unique identifier' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 'Eid Festival', description: 'The name of the festival' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ example: '2023-01-01', description: 'The start date' })
  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @ApiProperty({ example: '2023-01-05', description: 'The end date' })
  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @ApiProperty({ example: true, description: 'Is the festival active?' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
