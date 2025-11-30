import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { ProductModule } from "./product/product.module";
import { Product } from "./entity/product.entity";
import { ImageModule } from './image/image.module';
import { StoreModule } from './store/store.module';
import { Store } from "./entity/store.entity";
import { ReviewModule } from './review/review.module';
import { Review } from "./entity/review.entity";
import { CategoryModule } from './category/category.module';
import { Category } from "./entity/category.entity";
import { CouponModule } from './coupon/coupon.module';
import { Coupon } from "./entity/coupon.entity";
import { CheckoutModule } from './checkout/checkout.module';
import { Order } from "./entity/order.entity";
import { OrderItem } from "./entity/order-item.entity";
import { BrandModule } from './brand/brand.module';
import { WeightUnitModule } from './weight-unit/weight-unit.module';
import { Brand } from "./entity/brand.entity";
import { WeightUnit } from "./entity/weight-unit.entity";
import { PrescriptionModule } from './prescription/prescription.module';
import { Prescription } from "./entity/prescription.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "9qasp5v56q8ckkf5dc.leapcellpool.com:6438",
      port: 3306,
      username: "frvoxctukhrcvdltrwhb",
      password: "hedqqbfboiewaisqjqeneuqwskseoh",
      database: "xugntwksjhpepkvutfaf",
      entities: [User, Product,Store,Brand, WeightUnit, Review, Category, Coupon, Prescription, Order, OrderItem],
      synchronize: true,
    }),
    AuthModule,
    ProductModule,
    ImageModule,
    StoreModule,
    ReviewModule,
    CategoryModule,
    CouponModule,
    CheckoutModule,
    BrandModule,
    WeightUnitModule,
    PrescriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
