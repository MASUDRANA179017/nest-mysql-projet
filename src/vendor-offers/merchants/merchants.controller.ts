import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import { Merchant } from '../entities/merchant.entity';

@ApiTags('merchants')
@Controller('vendor-offers/merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create merchant' })
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
