import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';

@ApiTags('support')
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get()
  @ApiOperation({ summary: 'Get all support tickets' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.supportService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get support ticket by id' })
  @ApiResponse({ status: 200 })
  findOne(@Param('id') id: number) {
    return this.supportService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create support ticket' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateSupportDto) {
    return this.supportService.create(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update support ticket' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: number, @Body() dto: CreateSupportDto) {
    return this.supportService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete support ticket' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: number) {
    return this.supportService.remove(id);
  }
}
