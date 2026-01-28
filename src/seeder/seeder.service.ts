import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entity/category.entity';
import { Merchant, MerchantStatus } from '../vendor-offers/entities/merchant.entity';
import { Offer, OfferStatus } from '../vendor-offers/entities/offer.entity';
import { OfferType } from '../vendor-offers/entities/offer-template.entity';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { City } from '../vendor-offers/entities/city.entity';
import { Area } from '../vendor-offers/entities/area.entity';
import { OfferCategory } from '../vendor-offers/entities/offer-category.entity';
import { OfferTemplate } from '../vendor-offers/entities/offer-template.entity';
import { Festival } from '../vendor-offers/entities/festival.entity';
import { VendorAdmin, AdminRole } from '../vendor-offers/entities/vendor-admin.entity';
import { MerchantPermission } from '../vendor-offers/entities/merchant-permission.entity';
import { MerchantSubscription, SubscriptionStatus } from '../vendor-offers/entities/merchant-subscription.entity';
import { FeaturedOffer, FeaturedPosition } from '../vendor-offers/entities/featured-offer.entity';
import { OfferReport, ReportedBy, ReportStatus } from '../vendor-offers/entities/offer-report.entity';
import { VisitorSession } from '../vendor-offers/entities/visitor-session.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeederService implements OnModuleInit {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Merchant)
        private readonly merchantRepository: Repository<Merchant>,
        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(City)
        private readonly cityRepository: Repository<City>,
        @InjectRepository(Area)
        private readonly areaRepository: Repository<Area>,
        @InjectRepository(OfferCategory)
        private readonly offerCategoryRepository: Repository<OfferCategory>,
        @InjectRepository(OfferTemplate)
        private readonly offerTemplateRepository: Repository<OfferTemplate>,
        @InjectRepository(Festival)
        private readonly festivalRepository: Repository<Festival>,
        @InjectRepository(VendorAdmin)
        private readonly vendorAdminRepository: Repository<VendorAdmin>,
        @InjectRepository(MerchantPermission)
        private readonly merchantPermissionRepository: Repository<MerchantPermission>,
        @InjectRepository(MerchantSubscription)
        private readonly merchantSubscriptionRepository: Repository<MerchantSubscription>,
        @InjectRepository(FeaturedOffer)
        private readonly featuredOfferRepository: Repository<FeaturedOffer>,
        @InjectRepository(OfferReport)
        private readonly offerReportRepository: Repository<OfferReport>,
        @InjectRepository(VisitorSession)
        private readonly visitorSessionRepository: Repository<VisitorSession>,
    ) {}

    async onModuleInit() {
        await this.seedCitiesAndAreas();
        await this.seedSuperAdmin();
        await this.seedCategories();
        await this.seedMerchants();
        await this.seedOfferCategories();
        await this.seedOfferTemplates();
        await this.seedFestivals();
        await this.seedVendorAdmins();
        await this.seedMerchantPermissions();
        await this.seedMerchantSubscriptions();
        await this.seedOffers();
        await this.seedFeaturedOffers();
        await this.seedOfferReports();
        await this.seedVisitorSessions();
    }

    private async seedCitiesAndAreas() {
        let city = await this.cityRepository.findOne({ where: { name: 'Test City' } });
        if (!city) {
            city = this.cityRepository.create({ name: 'Test City', isActive: true });
            city = await this.cityRepository.save(city);
        }
        if (!city) throw new Error('City seeding failed');
            let area = await this.areaRepository.findOne({ where: { name: 'Test Area', cityId: city.id } });
            if (!area) {
                area = this.areaRepository.create({ name: 'Test Area', cityId: city.id });
                area = await this.areaRepository.save(area);
            }
            if (!area) throw new Error('Area seeding failed');
        if (!area) {
            area = this.areaRepository.create({ name: 'Test Area', cityId: city.id });
            area = await this.areaRepository.save(area);
        }
        if (!area) throw new Error('Area seeding failed');
    }

    private async seedSuperAdmin() {
        const email = 'superadmin@example.com';
        const password = 'SuperAdmin@123';
        let user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = this.userRepository.create({
                email,
                password: hashedPassword,
                firstName: 'Super',
                lastName: 'Admin',
                username: 'superadmin',
                isActive: true,
                role: 'admin',
                walletBalance: 0,
                walletPoints: 0
            });
            await this.userRepository.save(user);
            console.log('Superadmin user created:', email);
        } else {
            console.log('Superadmin user already exists:', email);
        }
    }

    private async seedCategories() {
        const categories = [
            {
                name: 'Safety & Emergency Services',
                subcategories: [
                    'Police assistance',
                    'Fire emergency',
                    'Ambulance',
                    'Private security',
                    'Disaster response',
                ],
            },
            {
                name: 'Infrastructure & Utility Services',
                subcategories: [
                    'Water supply & repair',
                    'Electricity connection & repair',
                    'Gas services',
                    'Sanitation & waste management',
                    'Road & transport services',
                ],
            },
            {
                name: 'Healthcare Services',
                subcategories: [
                    'Doctor appointment',
                    'Hospital services',
                    'Home nursing',
                    'Diagnostic tests',
                    'Pharmacy & medicine delivery',
                ],
            },
            {
                name: 'Education & Training Services',
                subcategories: [
                    'School & college services',
                    'Private tutoring',
                    'Online courses',
                    'Skill training',
                    'Exam preparation',
                ],
            },
            {
                name: 'Home & Public Services',
                subcategories: [
                    'Plumbing',
                    'Electrical work',
                    'Cleaning services',
                    'Internet & cable services',
                    'Maintenance services',
                ],
            },
            {
                name: 'Economic & Social Services',
                subcategories: [
                    'Social welfare programs',
                    'Unemployment support',
                    'Legal aid',
                    'Financial services',
                    'NGO support',
                ],
            },
            {
                name: 'Transportation & Mobility',
                subcategories: [
                    'Public transport booking',
                    'Ride services',
                    'Vehicle repair',
                    'Logistics & delivery',
                ],
            },
            {
                name: 'Digital & Government Services',
                subcategories: [
                    'Online applications',
                    'Certificate services',
                    'Bill payments',
                    'Complaint & support system',
                ],
            },
            {
                name: 'Business & Professional Services',
                subcategories: [
                    'IT & software services',
                    'Marketing services',
                    'Consulting',
                    'Accounting & tax services',
                ],
            },
        ];

        console.log('Seeding categories...');

        for (const catData of categories) {
            // Check if Parent exists
            let parent = await this.categoryRepository.findOne({ where: { name: catData.name } });

            if (!parent) {
                parent = this.categoryRepository.create({
                    name: catData.name,
                    description: catData.name,
                });
                parent = await this.categoryRepository.save(parent);
                console.log(`Created parent category: ${catData.name}`);
            }

            // Create Children
            for (const subName of catData.subcategories) {
                // Check if Child exists under this parent
                const childExists = await this.categoryRepository.findOne({ 
                    where: { 
                        name: subName, 
                        parent: { id: parent.id } 
                    } 
                });

                if (!childExists) {
                    const child = this.categoryRepository.create({
                        name: subName,
                        description: subName,
                        parent: parent,
                    });
                    await this.categoryRepository.save(child);
                    console.log(`Created subcategory: ${subName}`);
                }
            }
        }

        console.log('Categories seeded successfully.');
    }

    private async seedMerchants() {
        const city = await this.cityRepository.findOne({ where: { name: 'Test City' } });
        if (!city) throw new Error('City not found for merchant seeding');
            const area = await this.areaRepository.findOne({ where: { name: 'Test Area', cityId: city.id } });
            if (!area) throw new Error('Area not found for merchant seeding');
        if (!area) throw new Error('Area not found for merchant seeding');
        const merchants = [
            {
                businessName: 'Merchant One',
                ownerName: 'Owner One',
                phone: '+1111111111',
                whatsapp: '+1111111111',
                email: 'merchant1@example.com',
                address: 'Address 1',
                cityId: city.id,
                areaId: area.id,
                trustScore: 100,
                status: MerchantStatus.APPROVED,
            },
            {
                businessName: 'Merchant Two',
                ownerName: 'Owner Two',
                phone: '+2222222222',
                whatsapp: '+2222222222',
                email: 'merchant2@example.com',
                address: 'Address 2',
                cityId: city.id,
                areaId: area.id,
                trustScore: 80,
                status: MerchantStatus.APPROVED,
            },
        ];
        for (const m of merchants) {
            let merchant = await this.merchantRepository.findOne({ where: { businessName: m.businessName } });
            if (!merchant) {
                merchant = this.merchantRepository.create(m);
                await this.merchantRepository.save(merchant);
                console.log(`Created merchant: ${m.businessName}`);
            }
        }
    }

    private async seedOfferCategories() {
        const merchant = await this.merchantRepository.findOne({ where: { businessName: 'Merchant One' } });
        if (!merchant) return;
        let offerCategory = await this.offerCategoryRepository.findOne({ where: { name: 'Electronics', merchantId: merchant.id } });
        if (!offerCategory) {
            offerCategory = this.offerCategoryRepository.create({ name: 'Electronics', icon: 'icon-url', merchantId: merchant.id });
            await this.offerCategoryRepository.save(offerCategory);
        }
    }

    private async seedOfferTemplates() {
        let template = await this.offerTemplateRepository.findOne({ where: { title: 'Holiday Sale' } });
        if (!template) {
            template = this.offerTemplateRepository.create({ title: 'Holiday Sale', description: 'Template description', offerType: OfferType.DISCOUNT });
            await this.offerTemplateRepository.save(template);
        }
    }

    private async seedFestivals() {
        let festival = await this.festivalRepository.findOne({ where: { name: 'Eid Festival' } });
        if (!festival) {
            festival = this.festivalRepository.create({ name: 'Eid Festival', startDate: '2023-01-01', endDate: '2023-01-05', isActive: true });
            await this.festivalRepository.save(festival);
        }
    }

    private async seedVendorAdmins() {
        let admin = await this.vendorAdminRepository.findOne({ where: { email: 'admin@example.com' } });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin = this.vendorAdminRepository.create({ name: 'Admin', email: 'admin@example.com', password: hashedPassword, role: AdminRole.SUPER });
            await this.vendorAdminRepository.save(admin);
        }
    }

    private async seedMerchantPermissions() {
        const merchant = await this.merchantRepository.findOne({ where: { businessName: 'Merchant One' } });
        if (!merchant) return;
        let permission = await this.merchantPermissionRepository.findOne({ where: { merchantId: merchant.id, module: 'products' } });
        if (!permission) {
            permission = this.merchantPermissionRepository.create({ merchantId: merchant.id, module: 'products', canAccess: true });
            await this.merchantPermissionRepository.save(permission);
        }
    }

    private async seedMerchantSubscriptions() {
        const merchant = await this.merchantRepository.findOne({ where: { businessName: 'Merchant One' } });
        if (!merchant) return;
        let subscription = await this.merchantSubscriptionRepository.findOne({ where: { merchantId: merchant.id, planName: 'Premium Plan' } });
        if (!subscription) {
            subscription = this.merchantSubscriptionRepository.create({ merchantId: merchant.id, planName: 'Premium Plan', price: 99.99, startDate: '2023-01-01', endDate: '2023-12-31', status: SubscriptionStatus.ACTIVE });
            await this.merchantSubscriptionRepository.save(subscription);
        }
    }

    private async seedFeaturedOffers() {
        const offer = await this.offerRepository.findOne({ where: { title: 'Super Sale' } });
        if (!offer) return;
        let featured = await this.featuredOfferRepository.findOne({ where: { offerId: offer.id } });
        if (!featured) {
            featured = this.featuredOfferRepository.create({ offerId: offer.id, position: FeaturedPosition.HOME_TOP, startDate: '2023-01-01', endDate: '2023-01-31', isPaid: true });
            await this.featuredOfferRepository.save(featured);
        }
    }

    private async seedOfferReports() {
        const offer = await this.offerRepository.findOne({ where: { title: 'Super Sale' } });
        if (!offer) return;
        let report = await this.offerReportRepository.findOne({ where: { offerId: offer.id } });
        if (!report) {
            report = this.offerReportRepository.create({ offerId: offer.id, reason: 'Inappropriate content', reportedBy: ReportedBy.USER, status: ReportStatus.OPEN });
            await this.offerReportRepository.save(report);
        }
    }

    private async seedVisitorSessions() {
        let city = await this.cityRepository.findOne({ where: { name: 'Test City' } });
        if (!city) throw new Error('City not found for visitor session seeding');
        let area = await this.areaRepository.findOne({ where: { name: 'Test Area', cityId: city.id } });
        if (!area) throw new Error('Area not found for visitor session seeding');
        let session = await this.visitorSessionRepository.findOne({ where: { sessionId: 'session-123' } });
        if (!session) {
            session = this.visitorSessionRepository.create({ sessionId: 'session-123', cityId: city.id, areaId: area.id, device: 'Mobile' });
            await this.visitorSessionRepository.save(session);
        }
    }

    private async seedOffers() {
        const merchant = await this.merchantRepository.findOne({ where: { businessName: 'Merchant One' } });
        if (!merchant) return;
        const category = await this.offerCategoryRepository.findOne({ where: { name: 'Electronics', merchantId: merchant.id } });
        if (!category) {
            console.warn('No OfferCategory found. Please seed offer categories first.');
            return;
        }
        const city = await this.cityRepository.findOne({ where: { name: 'Test City' } });
        if (!city) throw new Error('City not found for offer seeding');
        const area = await this.areaRepository.findOne({ where: { name: 'Test Area', cityId: city.id } });
        if (!area) throw new Error('Area not found for offer seeding');
        const template = await this.offerTemplateRepository.findOne({ where: { title: 'Holiday Sale' } });
        const offers = [
            {
                merchantId: merchant.id,
                categoryId: category.id,
                cityId: city.id,
                areaId: area.id,
                templateId: template?.id,
                title: 'Super Sale',
                description: '50% off everything!',
                offerType: OfferType.DISCOUNT,
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isVerified: true,
                isFeatured: false,
                status: OfferStatus.APPROVED,
            },
        ];
        for (const o of offers) {
            let offer = await this.offerRepository.findOne({ where: { title: o.title } });
            if (!offer) {
                offer = this.offerRepository.create(o);
                await this.offerRepository.save(offer);
                console.log(`Created offer: ${o.title}`);
            }
        }
    }
}
