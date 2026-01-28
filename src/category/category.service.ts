import { Category } from 'src/entity/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Store } from 'src/entity/store.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Store)
        private storeRepository: Repository<Store>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create(createCategoryDto);
        if (createCategoryDto.parentId) {
            const parent = await this.categoryRepository.findOne({ where: { id: createCategoryDto.parentId } });
            if (parent) {
                category.parent = parent;
            }
        }
        
        // If you want to associate a store, push it to the stores array
        if (createCategoryDto.storeId) {
            const store = await this.storeRepository.findOne({ where: { id: createCategoryDto.storeId } });
            if (!store) {
                throw new NotFoundException(`Store with id ${createCategoryDto.storeId} not found`);
            }
            category.stores = [store];
        }

        return this.categoryRepository.save(category);

    }

    async getAllCategories(): Promise<Category[]> {
        return this.categoryRepository.find({ 
            where: { parent: IsNull() },
            relations: ['children', 'stores'] 
        });
    }

    async getCategoriesByStore(storeId: number): Promise<Category[]> {
        // Fetch only store specific categories
        return this.categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.children', 'children')
            .leftJoin('category.stores', 'store')
            .where('store.id = :storeId', { storeId })
            .andWhere('category.parent IS NULL')
            .getMany();
    }

    async getCategoriesByType(type: string): Promise<Category[]> {
        return this.categoryRepository.find({
            where: { type, parent: IsNull() },
            relations: ['children', 'stores']
        });
    }

    async getCategoryById(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({ 
            where: { id },
            relations: ['children', 'parent', 'stores']
        });
        if (!category) {
            throw new Error(`Category with id ${id} not found`);
        }
        return category;
    }

    async update(id: number, updateCategoryDto: CreateCategoryDto): Promise<Category> {
        await this.categoryRepository.update(id, { 
            name: updateCategoryDto.name, 
            description: updateCategoryDto.description,
            type: updateCategoryDto.type 
        });
        const updatedCategory = await this.categoryRepository.findOne({ where: { id } });
        if (!updatedCategory) {
            throw new Error(`Category with id ${id} not found`);
        }
        return updatedCategory;
    }

    async delete(id: number): Promise<void> {
        const result = await this.categoryRepository.delete(id);
        if (result.affected === 0) {
            throw new Error(`Category with id ${id} not found`);
        }
    }

    // Vendor specific methods

    async createForVendor(userId: number, createCategoryDto: CreateCategoryDto): Promise<Category> {
        // Find the store owned by the user
        const store = await this.storeRepository.findOne({ where: { owner: { id: userId } } });
        if (!store) {
            throw new NotFoundException(`Store for user ${userId} not found`);
        }

        const { storeId, ...categoryData } = createCategoryDto;

        const category = this.categoryRepository.create({
            ...categoryData,
            stores: [store]
        });

        if (createCategoryDto.parentId) {
            const parent = await this.categoryRepository.findOne({ where: { id: createCategoryDto.parentId } });
            if (parent) {
                category.parent = parent;
            }
        }

        return this.categoryRepository.save(category);
    }

    async updateForVendor(userId: number, categoryId: number, updateCategoryDto: CreateCategoryDto): Promise<Category> {
        const store = await this.storeRepository.findOne({ where: { owner: { id: userId } } });
        if (!store) {
            throw new NotFoundException(`Store for user ${userId} not found`);
        }

        const category = await this.categoryRepository.findOne({ where: { id: categoryId }, relations: ['stores'] });
        if (!category) {
            throw new NotFoundException(`Category with id ${categoryId} not found`);
        }

        if (!category.stores || !category.stores.some(s => s.id === store.id)) {
            throw new NotFoundException(`You do not have permission to update this category`);
        }

        const updateData: any = { 
            name: updateCategoryDto.name, 
            description: updateCategoryDto.description,
            type: updateCategoryDto.type
        };

        if (updateCategoryDto.parentId) {
             const parent = await this.categoryRepository.findOne({ where: { id: updateCategoryDto.parentId } });
             if (parent) {
                 updateData.parent = parent;
             }
        } else if (updateCategoryDto.parentId === null) {
            updateData.parent = null;
        }

        await this.categoryRepository.save({
            id: categoryId,
            ...updateData
        });

        const updatedCategory = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!updatedCategory) {
            throw new NotFoundException(`Category with id ${categoryId} not found`);
        }
        return updatedCategory;
    }

    async deleteForVendor(userId: number, categoryId: number): Promise<void> {
        const store = await this.storeRepository.findOne({ where: { owner: { id: userId } } });
        if (!store) {
            throw new NotFoundException(`Store for user ${userId} not found`);
        }

        const category = await this.categoryRepository.findOne({ where: { id: categoryId }, relations: ['stores'] });
        if (!category) {
            throw new NotFoundException(`Category with id ${categoryId} not found`);
        }

        if (!category.stores || !category.stores.some(s => s.id === store.id)) {
            throw new NotFoundException(`You do not have permission to delete this category`);
        }

        await this.categoryRepository.delete(categoryId);
    }

    async getVendorCategories(userId: number): Promise<Category[]> {
        const store = await this.storeRepository.findOne({ where: { owner: { id: userId } } });
        if (!store) {
            // If user has no store, return empty or throw? 
            // Returning empty is safer.
            return [];
        }

        return this.categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.children', 'children')
            .leftJoinAndSelect('category.parent', 'parent')
            .leftJoin('category.stores', 'store')
            .where('store.id = :storeId', { storeId: store.id })
            .getMany();
    }
}
