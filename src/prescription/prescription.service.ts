import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Prescription } from 'src/entity/prescription.entity';
import { User } from 'src/entity/user.entity';
import { Product } from 'src/entity/product.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Injectable()
export class PrescriptionService {
    constructor(
        @InjectRepository(Prescription)
        private prescriptionRepository: Repository<Prescription>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    // CREATE -----------------------------------------------------
    async create(prescriptionDto: CreatePrescriptionDto, userId: number): Promise<Prescription> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new ForbiddenException(`User with id ${userId} not found`);
        }
        // Find owner
        const owner = await this.userRepository.findOne({
            where: { id: prescriptionDto.ownerId },
        });

        if (!owner) {
            throw new ForbiddenException(`User with id ${prescriptionDto.ownerId} not found`);
        }

        // Find products
        const products = prescriptionDto.productIds?.length
        ? await this.productRepository.find({
              where: { id: In(prescriptionDto.productIds) },
          })
        : [];

        // Create prescription
        const prescription = this.prescriptionRepository.create({
            ...prescriptionDto,
            owner,
            products,
        });

        return this.prescriptionRepository.save(prescription);
     }

    // GET ALL -----------------------------------------------------
    async getAll(): Promise<Prescription[]> {
        return this.prescriptionRepository.find({
            relations: ['owner', 'products'],
        });
    }

    // GET ONE -----------------------------------------------------
    async getById(id: number): Promise<Prescription> {
        const prescription = await this.prescriptionRepository.findOne({
            where: { id },
            relations: ['owner', 'products'],
        });

        if (!prescription) throw new ForbiddenException(`Prescription with id ${id} not found`);
        return prescription;
    }

    // UPDATE -----------------------------------------------------
    async update(id: number, dto: UpdatePrescriptionDto): Promise<Prescription> {
        const prescription = await this.prescriptionRepository.findOne({
            where: { id },
            relations: ['products'],
        });

        if (!prescription) throw new ForbiddenException(`Prescription with id ${id} not found`);

        // Update owner
        if (dto.ownerId) {
            const owner = await this.userRepository.findOneBy({ id: dto.ownerId });
            if (!owner) throw new ForbiddenException(`Owner with id ${dto.ownerId} not found`);
            prescription.owner = owner;
        }

        // Update products
        if (dto.productIds) {
            const products = await this.productRepository.find({
                where: { id: In(dto.productIds) },
            });
            prescription.products = products; // ✅ corrected
        }

        // Update dates
        if (dto.visitingDate) prescription.visitingDate = new Date(dto.visitingDate);
        if (dto.nextVisitingDate) prescription.nextVisitingDate = new Date(dto.nextVisitingDate);

        Object.assign(prescription, dto);

        return this.prescriptionRepository.save(prescription);
    }

    // DELETE -----------------------------------------------------
    async delete(id: number): Promise<void> {
        const result = await this.prescriptionRepository.delete(id);
        if (result.affected === 0) {
            throw new ForbiddenException(`Prescription with id ${id} not found`);
        }
    }
}
