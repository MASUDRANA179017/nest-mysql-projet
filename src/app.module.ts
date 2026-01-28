import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
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
import { VendorOffersModule } from "./vendor-offers/vendor-offers.module";
import { Area } from "./vendor-offers/entities/area.entity";
import { City } from "./vendor-offers/entities/city.entity";
import { FeaturedOffer } from "./vendor-offers/entities/featured-offer.entity";
import { Festival } from "./vendor-offers/entities/festival.entity";
import { MerchantSubscription } from "./vendor-offers/entities/merchant-subscription.entity";
import { Merchant } from "./vendor-offers/entities/merchant.entity";
import { OfferBookmark } from "./vendor-offers/entities/offer-bookmark.entity";
import { OfferCategory } from "./vendor-offers/entities/offer-category.entity";
import { OfferClick } from "./vendor-offers/entities/offer-click.entity";
import { OfferReport } from "./vendor-offers/entities/offer-report.entity";
import { OfferTemplate } from "./vendor-offers/entities/offer-template.entity";
import { Offer } from "./vendor-offers/entities/offer.entity";
import { VendorAdmin } from "./vendor-offers/entities/vendor-admin.entity";
import { VisitorSession } from "./vendor-offers/entities/visitor-session.entity";
import { MerchantPermission } from "./vendor-offers/entities/merchant-permission.entity";


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'nest_ecommerce_v2',
      entities: [
        User, Product, Store, Brand, WeightUnit, Review, Category, Coupon, Prescription, Order, OrderItem, Invoice, PosSession, PosTransaction, WalletTransaction, Blog,
        Area, City, FeaturedOffer, Festival, MerchantSubscription, Merchant, OfferBookmark, OfferCategory, OfferClick, OfferReport, OfferTemplate, Offer, VendorAdmin, VisitorSession, MerchantPermission
      ],
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
    VendorOffersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
