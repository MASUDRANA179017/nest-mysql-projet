import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { Offer } from '../entities/offer.entity';

@ApiTags('offers')
@Controller('vendor-offers/offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @ApiOperation({ summary: 'Create offer' })
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
