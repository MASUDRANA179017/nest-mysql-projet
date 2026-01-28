import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from '../entities/merchant.entity';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private merchantsRepository: Repository<Merchant>,
  ) {}

  create(createMerchantDto: any) {
    return this.merchantsRepository.save(createMerchantDto);
  }

  findAll() {
    return this.merchantsRepository.find({ relations: ['city', 'area'] });
  }

  findOne(id: number) {
    return this.merchantsRepository.findOne({ where: { id }, relations: ['city', 'area'] });
  }

  update(id: number, updateMerchantDto: any) {
    return this.merchantsRepository.update(id, updateMerchantDto);
  }

  remove(id: number) {
    return this.merchantsRepository.delete(id);
  }
}
