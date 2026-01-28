import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all analytics reports' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.analyticsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get analytics report by id' })
  @ApiResponse({ status: 200 })
  findOne(@Param('id') id: number) {
    return this.analyticsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create analytics report' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateAnalyticsDto) {
    return this.analyticsService.create(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update analytics report' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: number, @Body() dto: UpdateAnalyticsDto) {
    return this.analyticsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete analytics report' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: number) {
    return this.analyticsService.remove(id);
  }
}
