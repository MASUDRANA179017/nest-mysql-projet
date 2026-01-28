import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { City } from '../entities/city.entity';

@ApiTags('cities')
@Controller('vendor-offers/cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create city' })
  @ApiBody({
    schema: {
      example: {
        name: 'Dhaka',
        isActive: true
      }
    }
  })
  @ApiResponse({ status: 201, description: 'The city has been successfully created.', type: City })
  create(@Body() createCityDto: any) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, description: 'Return all cities.', type: [City] })
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get city by id' })
  @ApiResponse({ status: 200, description: 'Return city.', type: City })
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update city' })
  @ApiBody({
    schema: {
      example: {
        name: 'Dhaka Updated',
        isActive: false
      }
    }
  })
  @ApiResponse({ status: 200, description: 'The city has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateCityDto: any) {
    return this.citiesService.update(+id, updateCityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete city' })
  @ApiResponse({ status: 200, description: 'The city has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.citiesService.remove(+id);
  }
}
