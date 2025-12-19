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
        
        if (createCategoryDto.storeId) {
            const store = await this.storeRepository.findOne({ where: { id: createCategoryDto.storeId } });
            if (!store) {
                throw new NotFoundException(`Store with id ${createCategoryDto.storeId} not found`);
            }
            category.store = store;
        }

        return this.categoryRepository.save(category);

    }

    async getAllCategories(): Promise<Category[]> {
        return this.categoryRepository.find({ 
            where: { parent: IsNull(), store: IsNull() },
            relations: ['children'] 
        });
    }

    async getCategoriesByStore(storeId: number): Promise<Category[]> {
        // Fetch global categories (store is null) AND store specific categories
        return this.categoryRepository.find({
            where: [
                { store: { id: storeId }, parent: IsNull() },
                { store: IsNull(), parent: IsNull() }
            ],
            relations: ['children']
        });
    }

    async getCategoryById(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({ 
            where: { id },
            relations: ['children', 'parent', 'store']
        });
        if (!category) {
            throw new Error(`Category with id ${id} not found`);
        }
        return category;
    }

    async update(id: number, updateCategoryDto: CreateCategoryDto): Promise<Category> {
        await this.categoryRepository.update(id, { name: updateCategoryDto.name, description: updateCategoryDto.description });
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

        const category = this.categoryRepository.create({
            ...createCategoryDto,
            store: store
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

        const category = await this.categoryRepository.findOne({ where: { id: categoryId }, relations: ['store'] });
        if (!category) {
            throw new NotFoundException(`Category with id ${categoryId} not found`);
        }

        if (!category.store || category.store.id !== store.id) {
            throw new NotFoundException(`You do not have permission to update this category`);
        }

        await this.categoryRepository.update(categoryId, { 
            name: updateCategoryDto.name, 
            description: updateCategoryDto.description 
        });

        return this.categoryRepository.findOne({ where: { id: categoryId } });
    }

    async deleteForVendor(userId: number, categoryId: number): Promise<void> {
        const store = await this.storeRepository.findOne({ where: { owner: { id: userId } } });
        if (!store) {
            throw new NotFoundException(`Store for user ${userId} not found`);
        }

        const category = await this.categoryRepository.findOne({ where: { id: categoryId }, relations: ['store'] });
        if (!category) {
            throw new NotFoundException(`Category with id ${categoryId} not found`);
        }

        if (!category.store || category.store.id !== store.id) {
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

        return this.categoryRepository.find({
            where: { store: { id: store.id } },
            relations: ['children']
        });
    }
}
