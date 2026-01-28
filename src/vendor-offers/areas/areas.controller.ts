import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AreasService } from './areas.service';
import { Area } from '../entities/area.entity';

@ApiTags('areas')
@Controller('vendor-offers/areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @ApiOperation({ summary: 'Create area' })
  @ApiBody({
    schema: {
      example: {
        name: 'Banani',
        cityId: 1,
        isActive: true
      }
    }
  })
  @ApiResponse({ status: 201, description: 'The area has been successfully created.', type: Area })
  create(@Body() createAreaDto: any) {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all areas' })
  @ApiResponse({ status: 200, description: 'Return all areas.', type: [Area] })
  findAll() {
    return this.areasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get area by id' })
  @ApiResponse({ status: 200, description: 'Return area.', type: Area })
  findOne(@Param('id') id: string) {
    return this.areasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update area' })
  @ApiBody({
    schema: {
      example: {
        name: 'Banani Updated',
        cityId: 1,
        isActive: false
      }
    }
  })
  @ApiResponse({ status: 200, description: 'The area has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateAreaDto: any) {
    return this.areasService.update(+id, updateAreaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete area' })
  @ApiResponse({ status: 200, description: 'The area has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.areasService.remove(+id);
  }
}
