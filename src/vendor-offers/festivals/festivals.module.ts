import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Festival } from '../entities/festival.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Festival])],
  exports: [TypeOrmModule],
})
export class FestivalsModule {}
