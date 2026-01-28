import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

@ApiTags('delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all deliveries' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.deliveryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get delivery by id' })
  @ApiResponse({ status: 200 })
  findOne(@Param('id') id: number) {
    return this.deliveryService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create delivery' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateDeliveryDto) {
    return this.deliveryService.create(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update delivery' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: number, @Body() dto: CreateDeliveryDto) {
    return this.deliveryService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete delivery' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: number) {
    return this.deliveryService.remove(id);
  }
}
