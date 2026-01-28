import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}

  create(createCityDto: any) {
    return this.citiesRepository.save(createCityDto);
  }

  findAll() {
    return this.citiesRepository.find();
  }

  findOne(id: number) {
    return this.citiesRepository.findOneBy({ id });
  }

  update(id: number, updateCityDto: any) {
    return this.citiesRepository.update(id, updateCityDto);
  }

  remove(id: number) {
    return this.citiesRepository.delete(id);
  }
}
