import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { VendorAdmin } from '../entities/vendor-admin.entity';

@ApiTags('admins')
@Controller('vendor-offers/admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  @ApiOperation({ summary: 'Create admin' })
  @ApiResponse({ status: 201, description: 'The admin has been successfully created.', type: VendorAdmin })
  create(@Body() createAdminDto: any) {
    return this.adminsService.create(createAdminDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Return all admins.', type: [VendorAdmin] })
  findAll() {
    return this.adminsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin by id' })
  @ApiResponse({ status: 200, description: 'Return admin.', type: VendorAdmin })
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({ status: 200, description: 'The admin has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateAdminDto: any) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete admin' })
  @ApiResponse({ status: 200, description: 'The admin has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.adminsService.remove(+id);
  }
}
