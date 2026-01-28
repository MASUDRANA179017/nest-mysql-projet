import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from '../entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) {}

  create(createOfferDto: any) {
    return this.offersRepository.save(createOfferDto);
  }

  findAll() {
    return this.offersRepository.find({ relations: ['merchant', 'category', 'city', 'area'] });
  }

  findOne(id: number) {
    return this.offersRepository.findOne({ where: { id }, relations: ['merchant', 'category', 'city', 'area'] });
  }

  update(id: number, updateOfferDto: any) {
    return this.offersRepository.update(id, updateOfferDto);
  }

  remove(id: number) {
    return this.offersRepository.delete(id);
  }
}
