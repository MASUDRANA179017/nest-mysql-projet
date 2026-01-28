import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ModuleAccess } from '../vendor-offers/common/module-access.decorator';
import { ModuleAccessGuard } from '../vendor-offers/common/module-access.guard';

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(ModuleAccessGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ModuleAccess('inventory')
  @ApiOperation({ summary: 'Get all inventory logs' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @ModuleAccess('inventory')
  @ApiOperation({ summary: 'Get inventory log by id' })
  @ApiResponse({ status: 200 })
  findOne(@Param('id') id: number) {
    return this.inventoryService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ModuleAccess('inventory')
  @ApiOperation({ summary: 'Create inventory log' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ModuleAccess('inventory')
  @ApiOperation({ summary: 'Update inventory log' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: number, @Body() dto: CreateInventoryDto) {
    return this.inventoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ModuleAccess('inventory')
  @ApiOperation({ summary: 'Delete inventory log' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: number) {
    return this.inventoryService.remove(id);
  }
}
