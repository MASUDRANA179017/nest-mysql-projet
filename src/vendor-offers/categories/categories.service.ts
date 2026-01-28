import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfferCategory } from '../entities/offer-category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(OfferCategory)
    private categoriesRepository: Repository<OfferCategory>,
  ) {}

  create(createCategoryDto: any) {
    return this.categoriesRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoriesRepository.find();
  }

  findOne(id: number) {
    return this.categoriesRepository.findOneBy({ id });
  }

  update(id: number, updateCategoryDto: any) {
    return this.categoriesRepository.update(id, updateCategoryDto);
  }

  remove(id: number) {
    return this.categoriesRepository.delete(id);
  }
}
