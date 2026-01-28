import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoyaltyService } from './loyalty.service';
import { CreateLoyaltyDto } from './dto/create-loyalty.dto';

@ApiTags('loyalty')
@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all loyalty points' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.loyaltyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get loyalty point by id' })
  @ApiResponse({ status: 200 })
  findOne(@Param('id') id: number) {
    return this.loyaltyService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create loyalty point' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateLoyaltyDto) {
    return this.loyaltyService.create(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update loyalty point' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: number, @Body() dto: CreateLoyaltyDto) {
    return this.loyaltyService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete loyalty point' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: number) {
    return this.loyaltyService.remove(id);
  }
}
