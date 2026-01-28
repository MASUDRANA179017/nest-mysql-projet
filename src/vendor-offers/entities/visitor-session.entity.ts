import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { City } from './city.entity';
import { Area } from './area.entity';

@Entity('visitor_sessions')
export class VisitorSession {
  @ApiProperty({ example: 1, description: 'The unique identifier' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 'session-123', description: 'The session ID' })
  @Column({ name: 'session_id', length: 100 })
  sessionId: string;

  @ApiProperty({ example: 1, description: 'The city ID', required: false })
  @Column({ name: 'city_id', type: 'bigint', nullable: true })
  cityId: number;

  @ApiProperty({ example: 1, description: 'The area ID', required: false })
  @Column({ name: 'area_id', type: 'bigint', nullable: true })
  areaId: number;

  @ApiProperty({ example: 'Mobile', description: 'The device type', required: false })
  @Column({ length: 50, nullable: true })
  device: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => City, (city) => city.visitorSessions)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => Area, (area) => area.visitorSessions)
  @JoinColumn({ name: 'area_id' })
  area: Area;
}
