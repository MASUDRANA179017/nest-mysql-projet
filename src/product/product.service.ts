import { WeightUnit } from 'src/entity/weight-unit.entity';
import { ImageService } from './../image/image.service';
import { User } from 'src/entity/user.entity';
import { ForbiddenException, Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entity/product.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateProductDto } from './dto/crate-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Store } from 'src/entity/store.entity';
import { Category } from 'src/entity/category.entity';
import { Brand } from 'src/entity/brand.entity';
import { Review } from 'src/entity/review.entity';
import { OrderItem } from 'src/entity/order-item.entity';


@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private readonly imageService: ImageService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Store)
        private storeRepository: Repository<Store>,
        @InjectRepository(WeightUnit)
        private weightUnitRepository: Repository<WeightUnit>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Brand)
        private brandRepository: Repository<Brand>,
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
    ) { }

    async createProduct(createProductDto: CreateProductDto, userId: number): Promise<Product> {
        const { storeId, categoryId, weightUnitId, brandId, ...productData } = createProductDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        const store = await this.storeRepository.findOne({ where: { id: storeId }, relations: ['owner'] });
        if (!store) {
            throw new NotFoundException(`Store with ID ${storeId} not found`);
        }

        let weightUnit: WeightUnit | null = null;
        if (weightUnitId) {
            weightUnit = await this.weightUnitRepository.findOne({ where: { id: weightUnitId } });
            if (!weightUnit) {
                throw new NotFoundException(`Weight Unit with ID ${weightUnitId} not found`);
            }
        }

        let brand: Brand | null = null;
        if (brandId) {
            brand = await this.brandRepository.findOne({ where: { id: brandId } });
            if (!brand) {
                throw new NotFoundException(`Brand with ID ${brandId} not found`);
            }
        }


        // Allow admin or store owner
        if (store.owner.role === 'admin' || store.owner.id !== userId) {
            throw new ForbiddenException(`You do not have permission to use this store`);
        }

        // Check for duplicate product name
        const existingProduct = await this.productRepository.findOne({ where: { name: productData.name } });
        if (existingProduct) {
            throw new ConflictException(`Product with name "${productData.name}" already exists.`);
        }

        const category = await this.categoryRepository.findOne({ where: { id: categoryId }, relations: ['store'] });
        if (!category) {
            throw new NotFoundException(`Category with ID ${categoryId} not found`);
        }

        // Validate category ownership (Global or Store-specific)
        if (category.store && category.store.id !== storeId) {
             throw new ForbiddenException(`Category with ID ${categoryId} does not belong to this store`);
        }

        const product = this.productRepository.create(
            {
                ...productData,
                stock: productData.stock ?? 0,
                vendor: user,
                store,
                weightUnit,
                category,
                brand,
            }
        );

        return this.productRepository.save(product);
    }

    async updateService(
        id: string,
        updateProductDto: UpdateProductDto,
        userId: number
    ): Promise<Product> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const product = await this.productRepository.findOne({
            where: { id: Number(id) },
            relations: ['store', 'vendor', 'category'],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Check for duplicate name
        if (updateProductDto.name && product.name !== updateProductDto.name) {
            const existingProduct = await this.productRepository.findOne({
                where: { name: updateProductDto.name },
            });
            if (existingProduct && existingProduct.id !== product.id) {
                throw new ConflictException(
                    `Product with name "${updateProductDto.name}" already exists.`
                );
            }
        }

        // Handle Thumbnail update
        if (updateProductDto.productThumbnail && updateProductDto.productThumbnail !== product.productThumbnail) {
            if (product.productThumbnail) {
                await this.imageService.deleteImage(product.productThumbnail, 'products');
            }
            product.productThumbnail = updateProductDto.productThumbnail;
        }

        // Handle Gallery update
        if (updateProductDto.productGallery) {
            const removedImages = product.productGallery?.filter(
                (img) => !updateProductDto.productGallery?.includes(img)
            ) || [];
            for (const imgUrl of removedImages) {
                await this.imageService.deleteImage(imgUrl, 'products');
            }
            product.productGallery = updateProductDto.productGallery;
        }

        // Update Service specific fields
        product.name = updateProductDto.name ?? product.name;
        product.description = updateProductDto.description ?? product.description;
        product.price = updateProductDto.price ?? product.price;
        product.schedule = updateProductDto.schedule ?? product.schedule;
        product.isAvailable = updateProductDto.isAvailable ?? product.isAvailable;

        // Update relations safely
        if (updateProductDto.storeId) {
            const store = await this.storeRepository.findOne({ where: { id: updateProductDto.storeId } });
            if (store) product.store = store;
        }

        if (updateProductDto.categoryId) {
            const category = await this.categoryRepository.findOne({ where: { id: updateProductDto.categoryId } });
            if (category) product.category = category;
        }

        return this.productRepository.save(product);
    }

    async updatePhysicalProduct(
        id: string,
        updateProductDto: UpdateProductDto,
        userId: number
    ): Promise<Product> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const product = await this.productRepository.findOne({
            where: { id: Number(id) },
            relations: ['store', 'vendor', 'category', 'brand', 'weightUnit'],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Check for duplicate name
        if (updateProductDto.name && product.name !== updateProductDto.name) {
            const existingProduct = await this.productRepository.findOne({
                where: { name: updateProductDto.name },
            });
            if (existingProduct && existingProduct.id !== product.id) {
                throw new ConflictException(
                    `Product with name "${updateProductDto.name}" already exists.`
                );
            }
        }

        // Handle Thumbnail update
        if (updateProductDto.productThumbnail && updateProductDto.productThumbnail !== product.productThumbnail) {
            if (product.productThumbnail) {
                await this.imageService.deleteImage(product.productThumbnail, 'products');
            }
            product.productThumbnail = updateProductDto.productThumbnail;
        }

        // Handle Gallery update
        if (updateProductDto.productGallery) {
            const removedImages = product.productGallery?.filter(
                (img) => !updateProductDto.productGallery?.includes(img)
            ) || [];
            for (const imgUrl of removedImages) {
                await this.imageService.deleteImage(imgUrl, 'products');
            }
            product.productGallery = updateProductDto.productGallery;
        }

        // Update Physical Product specific fields
        product.name = updateProductDto.name ?? product.name;
        product.description = updateProductDto.description ?? product.description;
        product.price = updateProductDto.price ?? product.price;
        product.stock = updateProductDto.stock ?? product.stock;
        product.manufactureDate = updateProductDto.manufactureDate ?? product.manufactureDate;
        product.expireDate = updateProductDto.expireDate ?? product.expireDate;
        product.barcode = updateProductDto.barcode ?? product.barcode;
        product.isAvailable = updateProductDto.isAvailable ?? product.isAvailable;

        // Update relations safely
        if (updateProductDto.storeId) {
            const store = await this.storeRepository.findOne({ where: { id: updateProductDto.storeId } });
            if (store) product.store = store;
        }

        if (updateProductDto.categoryId) {
            const category = await this.categoryRepository.findOne({ where: { id: updateProductDto.categoryId } });
            if (category) product.category = category;
        }

        if (updateProductDto.brandId) {
            const brand = await this.brandRepository.findOne({ where: { id: updateProductDto.brandId } });
            if (brand) product.brand = brand;
        }

        if (updateProductDto.weightUnitId) {
            const weightUnit = await this.weightUnitRepository.findOne({ where: { id: updateProductDto.weightUnitId } });
            if (weightUnit) product.weightUnit = weightUnit;
        }

        return this.productRepository.save(product);
    }



    async getAllProducts(type?: string): Promise<Product[]> {

        const where: any = {};
        if (type === 'service') {
            where.isService = true;
        } else if (type === 'product') {
            where.isService = false;
        }

        // all products
        return this.productRepository.find({
            where,
            relations: ['vendor', 'store', 'weightUnit' ,'category', 'reviews'],
        });

    }

    async getProductsByStoreId(storeId: number): Promise<Product[]> {
        return this.productRepository.find({
            where: { store: { id: storeId } },
            relations: ['vendor', 'store', 'weightUnit', 'category', 'reviews'],
        });
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: Number(id) }, relations: ['vendor', 'store', 'category', 'reviews'] });
        // const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        // if (!user) {
        //     throw new Error(`User with ID ${userId} not found`);
        // }
        // Ensure vendor and store relations are loaded
        const productWithRelations = await this.productRepository.findOne({
            where: { id: product.id },
            relations: ['vendor', 'store', 'category', 'reviews'],
        });

        if (!productWithRelations) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Optionally, check if store and vendor are defined
        if (!productWithRelations.vendor) {
            throw new InternalServerErrorException(`Vendor for product with ID ${id} is undefined`);
        }
        if (!productWithRelations.store) {
            throw new InternalServerErrorException(`Store for product with ID ${id} is undefined`);
        }


        return productWithRelations;
    }


    async updateProduct(
        id: string,
        updateProductDto: UpdateProductDto,
        userId: number
        ): Promise<Product> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const product = await this.productRepository.findOne({
            where: { id: Number(id) },
            relations: ['store', 'vendor', 'category', 'brand', 'weightUnit'],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Check for duplicate name
        if (updateProductDto.name && product.name !== updateProductDto.name) {
            const existingProduct = await this.productRepository.findOne({
            where: { name: updateProductDto.name },
            });
            if (existingProduct && existingProduct.id !== product.id) {
            throw new ForbiddenException(
                `Product with name "${updateProductDto.name}" already exists.`
            );
            }
        }

        // Handle Thumbnail update
        if (updateProductDto.productThumbnail && updateProductDto.productThumbnail !== product.productThumbnail) {
            if (product.productThumbnail) {
            await this.imageService.deleteImage(product.productThumbnail, 'products');
            }
            product.productThumbnail = updateProductDto.productThumbnail;
        }

        // Handle Gallery update
        if (updateProductDto.productGallery) {
            const removedImages = product.productGallery.filter(
            (img) => !updateProductDto.productGallery?.includes(img)
            );
            for (const imgUrl of removedImages) {
            await this.imageService.deleteImage(imgUrl, 'products');
            }
            product.productGallery = updateProductDto.productGallery;
        }

        // Update other fields
        product.name = updateProductDto.name ?? product.name;
        product.description = updateProductDto.description ?? product.description;
        product.price = updateProductDto.price ?? product.price;
        product.stock = updateProductDto.stock ?? product.stock;
        product.manufactureDate = updateProductDto.manufactureDate ?? product.manufactureDate;
        product.expireDate = updateProductDto.expireDate ?? product.expireDate;
        product.schedule = updateProductDto.schedule ?? product.schedule;
        product.isAvailable = updateProductDto.isAvailable ?? product.isAvailable;
        product.barcode = updateProductDto.barcode ?? product.barcode;

        // Update relations safely
        if (updateProductDto.storeId) {
            const store = await this.storeRepository.findOne({ where: { id: updateProductDto.storeId } });
            if (store) product.store = store;
        }

        if (updateProductDto.categoryId) {
            const category = await this.categoryRepository.findOne({ where: { id: updateProductDto.categoryId } });
            if (category) product.category = category;
        }

        if (updateProductDto.brandId) {
            const brand = await this.brandRepository.findOne({ where: { id: updateProductDto.brandId } });
            if (brand) product.brand = brand;
        }

        if (updateProductDto.weightUnitId) {
            const weightUnit = await this.weightUnitRepository.findOne({ where: { id: updateProductDto.weightUnitId } });
            if (weightUnit) product.weightUnit = weightUnit;
        }

        return this.productRepository.save(product);
    }


    async deleteProduct(id: string, userId: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        const product = await this.productRepository.findOne({
            where: { id: Number(id) },
            relations: ["vendor"],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Ensure vendor exists before checking ownership
        if (user.role !== 'admin') {
            if (!product.vendor || product.vendor.id !== user.id) {
                throw new ForbiddenException(`You are not authorized to delete this product`);
            }
        }

        try {
            // Delete thumbnail
            if (product.productThumbnail) {
                try {
                    await this.imageService.deleteImage(product.productThumbnail, 'products');
                } catch (e) {
                    console.error("Failed to delete thumbnail:", e);
                }
            }

            // Delete gallery images
            if (product.productGallery?.length) {
                for (const img of product.productGallery) {
                    try {
                        await this.imageService.deleteImage(img, 'products');
                    } catch (e) {
                        console.error("Failed to delete gallery image:", e);
                    }
                }
            }

            // Clean up related records (Force Delete)
            await this.reviewRepository.delete({ product: { id: Number(id) } });
            await this.orderItemRepository.delete({ product: { id: Number(id) } });

            await this.productRepository.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
                throw new ConflictException('Cannot delete product because it is referenced by other records (e.g., orders, reviews).');
            }
            throw new InternalServerErrorException('Failed to delete product');
        }
    }



    async vendorProduct(userId: number, type?: string): Promise<Product[]> {
        const user = await this.userRepository.findOneBy({ id: userId })

        const whereCondition: any = {};

        if (type === 'service') {
            whereCondition.isService = true;
        } else if (type === 'product') {
            whereCondition.isService = false;
        }

        if (user?.role === "admin") {
            // Admin sees all products
            return this.productRepository.find({
                where: whereCondition,
                relations: ['vendor', 'store', 'category', 'reviews'],
            });
        }
        if (user?.role === "vendor") {
            // Vendor sees only their own products
            // console.log("this.productRepository");

            return this.productRepository.find({
                where: { ...whereCondition, vendor: { id: userId } },
                relations: ['vendor', 'store', 'category', 'reviews'],
            });
        }
        return [];
    }



}
