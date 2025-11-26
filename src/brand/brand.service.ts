import { Brand } from 'src/entity/brand.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
    constructor(
        @InjectRepository(Brand)
        private brandRepository: Repository<Brand>,
    ) {}

    async create(createBrandDto: CreateBrandDto): Promise<Brand> {
        const brand = this.brandRepository.create(createBrandDto);
        return this.brandRepository.save(brand);
    }

    async getAllBrands(): Promise<Brand[]> {
        return this.brandRepository.find({
            relations: ['product'],
        });
    }

    async getBrandById(id: number): Promise<Brand> {
        const brand = await this.brandRepository.findOne({
            where: { id },
            relations: ['product'],
        });

        if (!brand) {
            throw new Error(`Brand with id ${id} not found`);
        }

        return brand;
    }

    async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
        await this.brandRepository.update(id, updateBrandDto);

        const updatedBrand = await this.brandRepository.findOne({
            where: { id },
            relations: ['product'],
        });

        if (!updatedBrand) {
            throw new Error(`Brand with id ${id} not found`);
        }

        return updatedBrand;
    }

    async delete(id: number): Promise<void> {
        const result = await this.brandRepository.delete(id);

        if (result.affected === 0) {
            throw new Error(`Brand with id ${id} not found`);
        }
    }
}
