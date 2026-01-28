import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { Offer } from '../entities/offer.entity';

@ApiTags('offers')
@Controller('vendor-offers/offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @ApiOperation({ summary: 'Create offer' })
  @ApiBody({
    schema: {
      example: {
        merchantId: 1,
        categoryId: 1,
        cityId: 1,
        areaId: 1,
        templateId: 1,
        title: 'Super Sale',
        description: '50% off everything!',
        offerType: 'discount',
        discountText: '50% OFF',
        promoCode: 'SALE50',
        startDate: '2026-01-29T00:00:00Z',
        endDate: '2026-02-05T00:00:00Z',
        banner: 'banner.jpg',
        isVerified: true,
        isFeatured: false,
        status: 'approved'
      }
    }
  })
  @ApiResponse({ status: 201, description: 'The offer has been successfully created.', type: Offer })
  create(@Body() createOfferDto: any) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all offers' })
  @ApiResponse({ status: 200, description: 'Return all offers.', type: [Offer] })
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get offer by id' })
  @ApiResponse({ status: 200, description: 'Return offer.', type: Offer })
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update offer' })
  @ApiBody({
    schema: {
      example: {
        title: 'Super Sale Updated',
        description: '60% off everything!',
        offerType: 'discount',
        discountText: '60% OFF',
        promoCode: 'SALE60',
        startDate: '2026-01-30T00:00:00Z',
        endDate: '2026-02-06T00:00:00Z',
        banner: 'banner2.jpg',
        isVerified: true,
        isFeatured: true,
        status: 'approved'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'The offer has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateOfferDto: any) {
    return this.offersService.update(+id, updateOfferDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete offer' })
  @ApiResponse({ status: 200, description: 'The offer has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.offersService.remove(+id);
  }
}
