import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entity/category.entity';
import { SeederService } from './seeder.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers: [SeederService],
})
export class SeederModule {}
