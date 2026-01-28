import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorSession } from '../entities/visitor-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VisitorSession])],
  exports: [TypeOrmModule],
})
export class VisitorSessionsModule {}
