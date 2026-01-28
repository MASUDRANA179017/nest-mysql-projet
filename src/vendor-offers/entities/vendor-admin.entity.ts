import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum AdminRole {
  SUPER = 'super',
  MODERATOR = 'moderator',
}

@Entity('vendor_admins')
export class VendorAdmin {
  @ApiProperty({ example: 1, description: 'The unique identifier of the admin' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'The name of the admin' })
  @Column({ length: 150 })
  name: string;

  @ApiProperty({ example: 'admin@example.com', description: 'The email of the admin' })
  @Column({ length: 150, unique: true })
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the admin' })
  @Column({ length: 255 })
  password: string;

  @ApiProperty({ enum: AdminRole, example: AdminRole.SUPER, description: 'The role of the admin' })
  @Column({
    type: 'enum',
    enum: AdminRole,
  })
  role: AdminRole;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'The creation date of the admin' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
