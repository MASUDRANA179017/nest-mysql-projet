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
import { InvoiceModule } from './invoice/invoice.module';
import { Invoice } from "./entity/invoice.entity";
import { PosModule } from './pos/pos.module';
import { PosSession } from "./entity/pos-session.entity";
import { PosTransaction } from "./entity/pos-transaction.entity";
import { BarcodeModule } from './barcode/barcode.module';
import { SeederModule } from './seeder/seeder.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WalletModule } from './wallet/wallet.module';
import { Blog } from "./entity/blog.entity";
import { BlogModule } from "./blog/blog.module";
import { WalletTransaction } from "./entity/wallet-transaction.entity";


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "nest_ecommerce",
      entities: [User, Product, Store, Brand, WeightUnit, Review, Category, Coupon, Prescription, Order, OrderItem, Invoice, PosSession, PosTransaction, WalletTransaction, Blog],
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
    InvoiceModule,
    InvoiceModule,
    PosModule,
    BarcodeModule,
    SeederModule,
    DashboardModule,
    WalletModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
