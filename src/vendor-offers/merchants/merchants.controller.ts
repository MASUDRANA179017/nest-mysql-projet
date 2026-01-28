import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import { Merchant } from '../entities/merchant.entity';

@ApiTags('merchants')
@Controller('vendor-offers/merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create merchant' })
  @ApiBody({
    schema: {
      example: {
        businessName: 'Tech Store',
        ownerName: 'Jane Doe',
        phone: '+1234567890',
        whatsapp: '+1234567890',
        email: 'merchant@example.com',
        address: '123 Main St',
        cityId: 1,
        areaId: 1,
        trustScore: 100,
        status: 'pending'
      }
    }
  })
  @ApiResponse({ status: 201, description: 'The merchant has been successfully created.', type: Merchant })
  create(@Body() createMerchantDto: any) {
    return this.merchantsService.create(createMerchantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all merchants' })
  @ApiResponse({ status: 200, description: 'Return all merchants.', type: [Merchant] })
  findAll() {
    return this.merchantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get merchant by id' })
  @ApiResponse({ status: 200, description: 'Return merchant.', type: Merchant })
  findOne(@Param('id') id: string) {
    return this.merchantsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update merchant' })
  @ApiBody({
    schema: {
      example: {
        businessName: 'Updated Tech Store',
        ownerName: 'John Smith',
        phone: '+1987654321',
        whatsapp: '+1987654321',
        email: 'updated@example.com',
        address: '456 New Ave',
        cityId: 2,
        areaId: 2,
        trustScore: 80,
        status: 'approved'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'The merchant has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateMerchantDto: any) {
    return this.merchantsService.update(+id, updateMerchantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete merchant' })
  @ApiResponse({ status: 200, description: 'The merchant has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.merchantsService.remove(+id);
  }
}
