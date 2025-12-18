import { Category } from 'src/entity/category.entity';
import { Product } from 'src/entity/product.entity';
import { ForbiddenException, Get, Injectable, Param, UseGuards } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entity/store.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Review } from 'src/entity/review.entity';

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(createStoreDto: CreateStoreDto, userId: number): Promise<Store> {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new ForbiddenException('User not found');
        }else if(user?.isActive===true) {
            // update user role to vendor
            user.role = 'vendor';
            await this.userRepository.save(user);
        }else{
            throw new ForbiddenException('Your account is not active. Please contact admin.');
        }
        
        const store = this.storeRepository.create({
            ...createStoreDto,
            owner: user,
            createdAt: new Date(),
        });

        if (createStoreDto.categoryId) {
            const category = await this.categoryRepository.findOne({ where: { id: createStoreDto.categoryId } });
            if (category) {
                store.category = category;
            }
        }

        return this.storeRepository.save(store);
    }


    async getAll(userId: number): Promise<(Store & { averageRating: number })[]> {
        const user = await this.userRepository.findOneBy({ id: userId });

        let stores: Store[];

        if (user?.role === "admin") {
            // Admin sees all stores
            stores = await this.storeRepository.find({
                relations: ['owner', 'category'],
            });
        } else {
            // Vendor sees only their own stores
            stores = await this.storeRepository.find({
                where: { owner: { id: userId } },
                relations: ['owner', 'category'],
            });
        }

        return Promise.all(
            stores.map(async (store) => {
                const averageRating = await this.calculateStoreReview(Number(store.id));
                return { ...store, averageRating };
            })
        );
    }

    // Public method to get all stores
    async getAllPublic(): Promise<(Store & { averageRating: number })[]> {
        const stores = await this.storeRepository.find({
            relations: ['owner', 'category'],
        });

        return Promise.all(
            stores.map(async (store) => {
                const averageRating = await this.calculateStoreReview(Number(store.id));
                return { ...store, averageRating };
            })
        );
    }

    async getStoreById(id: Number): Promise<Store> {

        const store = await this.storeRepository.findOne({
            where: { id: Number(id) },
            relations: ['owner', 'category']
        });

        if (!store) {
            throw new Error('Store not found');
        }

        return store;
    }

    async updateStore(id: number, updateStoreDto: UpdateStoreDto, userId: number): Promise<Store> {
        const store = await this.storeRepository.findOne({ where: { id }, relations: ['owner'] });

        if (!store) {
            throw new Error('Store not found');
        }
        if (store.owner.id !== userId) {
            throw new Error('You are not authorized to update this store');
        }

        const updatedStore = Object.assign(store, updateStoreDto);
        return this.storeRepository.save(updatedStore);
    }

    async updateOwnerStatus(ownerId: number, isActive: boolean, currentUserRole: string): Promise<User> {
        const owner = await this.userRepository.findOne({ where: { id: ownerId } });
        if (!owner) {
            throw new Error('Owner not found');
        }

        // Only admin or the owner themselves can update
        if (currentUserRole !== 'admin') {
            throw new Error('You are not authorized to update owner status');
        }

        owner.isActive = isActive;
        return this.userRepository.save(owner);
    }


    async deleteStore(id: number, userId: number): Promise<void> {
        const store = await this.storeRepository.findOne({ where: { id }, relations: ['owner'] });

        if (!store) {
            throw new Error('Store not found');
        }
        if (store.owner.id !== userId) {
            throw new Error('You are not authorized to delete this store');
        }

        await this.storeRepository.delete(id);
    }


    private async calculateStoreReview(storeId: number): Promise<number> {
        const products = await this.productRepository.find({
            where: { store: { id: storeId } },
            relations: ['reviews'],
        });

        const allRatings = products.flatMap((product) =>
            product.reviews ? product.reviews.map((review) => review.rating) : []
        );

        if (allRatings.length === 0) {
            return 0;
        }

        const average = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
        return parseFloat(average.toFixed(2));
    }
}
