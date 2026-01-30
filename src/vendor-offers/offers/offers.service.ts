import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from '../entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: any) {
    try {
      return await this.offersRepository.save(createOfferDto);
    } catch (error) {
      if (
        error.code === 'ER_NO_REFERENCED_ROW_2' &&
        error.sqlMessage &&
        error.sqlMessage.includes('`merchant_id`')
      ) {
        throw new BadRequestException('Use a valid existing merchant_id when creating the offer.');
      }
      throw error;
    }
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
