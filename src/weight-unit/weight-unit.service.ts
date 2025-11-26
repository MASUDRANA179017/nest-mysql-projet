import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateWeightUnitDto } from './dto/create-weight-unit.dto';
import { UpdateWeightUnitDto } from './dto/update-weight-unit.dto';
import { WeightUnit } from 'src/entity/weight-unit.entity';

@Injectable()
export class WeightUnitService {
    constructor(
        @InjectRepository(WeightUnit)
        private weightUnitRepository: Repository<WeightUnit>,
    ) {}

    async create(createWeightUnitDto: CreateWeightUnitDto): Promise<WeightUnit> {
        const unit = this.weightUnitRepository.create(createWeightUnitDto);
        return this.weightUnitRepository.save(unit);
    }

    async getAll(): Promise<WeightUnit[]> {
        return this.weightUnitRepository.find({
            relations: ['products'],
        });
    }

    async getById(id: number): Promise<WeightUnit> {
        const unit = await this.weightUnitRepository.findOne({
            where: { id },
            relations: ['products'],
        });

        if (!unit) {
            throw new Error(`Weight Unit with id ${id} not found`);
        }

        return unit;
    }

    async update(id: number, updateWeightUnitDto: UpdateWeightUnitDto): Promise<WeightUnit> {
        await this.weightUnitRepository.update(id, updateWeightUnitDto);

        const updated = await this.weightUnitRepository.findOne({
            where: { id },
            relations: ['products'],
        });

        if (!updated) {
            throw new Error(`Weight Unit with id ${id} not found`);
        }

        return updated;
    }

    async delete(id: number): Promise<void> {
        const result = await this.weightUnitRepository.delete(id);

        if (result.affected === 0) {
            throw new Error(`Weight Unit with id ${id} not found`);
        }
    }
}
