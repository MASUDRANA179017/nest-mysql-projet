import { Module } from '@nestjs/common';
import { AdminsModule } from './admins/admins.module';
import { CitiesModule } from './cities/cities.module';
import { AreasModule } from './areas/areas.module';
import { CategoriesModule } from './categories/categories.module';
import { MerchantsModule } from './merchants/merchants.module';
import { MerchantSubscriptionsModule } from './merchant-subscriptions/merchant-subscriptions.module';
import { OfferTemplatesModule } from './offer-templates/offer-templates.module';
import { OffersModule } from './offers/offers.module';
import { OfferClicksModule } from './offer-clicks/offer-clicks.module';
import { OfferBookmarksModule } from './offer-bookmarks/offer-bookmarks.module';
import { OfferReportsModule } from './offer-reports/offer-reports.module';
import { FeaturedOffersModule } from './featured-offers/featured-offers.module';
import { FestivalsModule } from './festivals/festivals.module';
import { VisitorSessionsModule } from './visitor-sessions/visitor-sessions.module';

@Module({
  imports: [
    AdminsModule,
    CitiesModule,
    AreasModule,
    CategoriesModule,
    MerchantsModule,
    MerchantSubscriptionsModule,
    OfferTemplatesModule,
    OffersModule,
    OfferClicksModule,
    OfferBookmarksModule,
    OfferReportsModule,
    FeaturedOffersModule,
    FestivalsModule,
    VisitorSessionsModule,
  ],
})
export class VendorOffersModule {}
