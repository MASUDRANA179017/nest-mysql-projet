import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Coupon } from 'src/entity/coupon.entity';
import { Store } from 'src/entity/store.entity';
import { Product } from 'src/entity/product.entity';
import { Category } from 'src/entity/category.entity';
import { User } from 'src/entity/user.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,

    @InjectRepository(Store)
    private storeRepository: Repository<Store>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCouponDto: CreateCouponDto, userId: number): Promise<Coupon> {
    const { code, discountType, discountValue, scope, storeId, productIds = [], categoryIds = [], expiresAt } = createCouponDto;

    // 1️⃣ Validate store ownership
    const store = await this.storeRepository.findOne({
      where: { id: storeId, owner: { id: userId } },
    });
    if (!store) throw new ForbiddenException('Store not found or you are not the owner');

    // 2️⃣ Check duplicate code
    const existingCoupon = await this.couponRepository.findOne({ where: { code } });
    if (existingCoupon) throw new ForbiddenException('Coupon code already exists');

    // 3️⃣ Validate scope
    let products: Product[] = [];
    let categories: Category[] = [];

    if (scope === 'PRODUCT') {
      if (!productIds.length) throw new BadRequestException('PRODUCT scope requires productIds');
      products = await this.productRepository.find({ where: { id: In(productIds), store: { id: storeId } } });
      if (products.length !== productIds.length)
        throw new BadRequestException('Some products not found or do not belong to this store');
    }

    if (scope === 'CATEGORY') {
      if (!categoryIds.length) throw new BadRequestException('CATEGORY scope requires categoryIds');
      categories = await this.categoryRepository.find({ where: { id: In(categoryIds) } });
      if (categories.length !== categoryIds.length)
        throw new BadRequestException('Some categories not found');
    }

    if (scope === 'FLAT' && (productIds.length || categoryIds.length)) {
      throw new BadRequestException('FLAT coupons do not require productIds or categoryIds');
    }

    // 4️⃣ Validate discount
    if (discountType === 'PERCENTAGE' && (discountValue <= 0 || discountValue > 100))
      throw new BadRequestException('Percentage discount must be between 1 and 100');

    if (discountType === 'FIXED' && discountValue <= 0)
      throw new BadRequestException('Fixed discount must be greater than 0');

    // 5️⃣ Create coupon entity
    const coupon = this.couponRepository.create({
        code,
        discountType,
        discountValue,
        scope,
        store,
        products: products.length ? products : undefined,
        categories: categories.length ? categories : undefined,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    return this.couponRepository.save(coupon);
  }

  async updateCoupon(id: number, updateCouponDto: UpdateCouponDto, userId: number): Promise<Coupon> {
    const { code, discountType, discountValue, scope, storeId, productIds = [], categoryIds = [], expiresAt } = updateCouponDto;

    const coupon = await this.couponRepository.findOne({
      where: { id },
      relations: ['store', 'products', 'categories'],
    });
    if (!coupon) throw new NotFoundException(`Coupon ${id} not found`);

    const store = await this.storeRepository.findOne({ where: { id: storeId, owner: { id: userId } } });
    if (!store) throw new ForbiddenException('Store not found or you are not the owner');

    if (code && code !== coupon.code) {
      const existingCoupon = await this.couponRepository.findOne({ where: { code } });
      if (existingCoupon) throw new ForbiddenException('Coupon code already exists');
    }

    // Update products/categories
    if (scope === 'PRODUCT') {
      const products = await this.productRepository.find({ where: { id: In(productIds), store: { id: storeId } } });
      if (products.length !== productIds.length)
        throw new BadRequestException('Some products not found or do not belong to this store');
      coupon.products = products;
      coupon.categories = [];
    } else if (scope === 'CATEGORY') {
      const categories = await this.categoryRepository.find({ where: { id: In(categoryIds) } });
      if (categories.length !== categoryIds.length)
        throw new BadRequestException('Some categories not found');
      coupon.categories = categories;
      coupon.products = [];
    } else if (scope === 'FLAT') {
      coupon.products = [];
      coupon.categories = [];
    }

    coupon.code = code ?? coupon.code;
    coupon.discountType = discountType ?? coupon.discountType;
    coupon.discountValue = discountValue ?? coupon.discountValue;
    coupon.scope = scope ?? coupon.scope;
    coupon.expiresAt = expiresAt ? new Date(expiresAt) : coupon.expiresAt;

    return this.couponRepository.save(coupon);
  }

  async getAllCoupons(userId: number): Promise<Coupon[]> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user?.role === 'admin') {
      return this.couponRepository.find({ relations: ['store', 'products', 'categories'] });
    } else {
      return this.couponRepository.find({
        where: { store: { owner: { id: userId } } },
        relations: ['store', 'products', 'categories']
      });
    }
  }

  async getCouponById(id: number): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({ where: { id }, relations: ['store', 'products', 'categories'] });
    if (!coupon) throw new NotFoundException(`Coupon ${id} not found`);
    return coupon;
  }

  async deleteCoupon(id: number, userId: number): Promise<void> {
    const coupon = await this.couponRepository.findOne({ where: { id }, relations: ['store'] });
    if (!coupon) throw new NotFoundException('Coupon not found');

    const store = coupon.store;
    if (!store || store.owner.id !== userId) throw new ForbiddenException('You are not the owner of this coupon');

    await this.couponRepository.delete(id);
  }
}
