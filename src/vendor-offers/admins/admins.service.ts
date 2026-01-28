import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorAdmin } from '../entities/vendor-admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(VendorAdmin)
    private adminsRepository: Repository<VendorAdmin>,
  ) {}

  create(createAdminDto: any) {
    return this.adminsRepository.save(createAdminDto);
  }

  findAll() {
    return this.adminsRepository.find();
  }

  findOne(id: number) {
    return this.adminsRepository.findOneBy({ id });
  }

  update(id: number, updateAdminDto: any) {
    return this.adminsRepository.update(id, updateAdminDto);
  }

  remove(id: number) {
    return this.adminsRepository.delete(id);
  }
}
