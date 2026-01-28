import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from '../entities/area.entity';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private areasRepository: Repository<Area>,
  ) {}

  create(createAreaDto: any) {
    return this.areasRepository.save(createAreaDto);
  }

  findAll() {
    return this.areasRepository.find({ relations: ['city'] });
  }

  findOne(id: number) {
    return this.areasRepository.findOne({ where: { id }, relations: ['city'] });
  }

  update(id: number, updateAreaDto: any) {
    return this.areasRepository.update(id, updateAreaDto);
  }

  remove(id: number) {
    return this.areasRepository.delete(id);
  }
}
