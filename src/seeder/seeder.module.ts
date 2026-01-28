import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entity/category.entity';
import { Merchant } from '../vendor-offers/entities/merchant.entity';
import { Offer } from '../vendor-offers/entities/offer.entity';
import { SeederService } from './seeder.service';
import { User } from '../entity/user.entity';
import { City } from '../vendor-offers/entities/city.entity';
import { Area } from '../vendor-offers/entities/area.entity';
import { OfferCategory } from '../vendor-offers/entities/offer-category.entity';
import { OfferTemplate } from '../vendor-offers/entities/offer-template.entity';
import { Festival } from '../vendor-offers/entities/festival.entity';
import { VendorAdmin } from '../vendor-offers/entities/vendor-admin.entity';
import { MerchantPermission } from '../vendor-offers/entities/merchant-permission.entity';
import { MerchantSubscription } from '../vendor-offers/entities/merchant-subscription.entity';
import { FeaturedOffer } from '../vendor-offers/entities/featured-offer.entity';
import { OfferReport } from '../vendor-offers/entities/offer-report.entity';
import { VisitorSession } from '../vendor-offers/entities/visitor-session.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        Category, Merchant, Offer, User, City, Area, OfferCategory, OfferTemplate, Festival, VendorAdmin, MerchantPermission, MerchantSubscription, FeaturedOffer, OfferReport, VisitorSession
    ])],
    providers: [SeederService],
})
export class SeederModule {}
