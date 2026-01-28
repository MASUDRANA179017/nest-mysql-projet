import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ModuleAccess } from '../../vendor-offers/common/module-access.decorator';
import { ModuleAccessGuard } from '../../vendor-offers/common/module-access.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { OfferCategory } from '../entities/offer-category.entity';
import { CreateOfferCategoryDto } from './dto/create-offer-category.dto';
import { UpdateOfferCategoryDto } from './dto/update-offer-category.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('categories')
@Controller('vendor-offers/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ModuleAccessGuard)
  @ModuleAccess('categories')
  @ApiOperation({ summary: 'Create category' })
  @ApiBody({
    schema: {
      example: {
        name: 'Electronics',
        icon: 'icon-url',
        merchantId: 1
      }
    }
  })
  @ApiResponse({ status: 201, description: 'The category has been successfully created.', type: OfferCategory })
  create(@Body() createCategoryDto: CreateOfferCategoryDto, @Request() req) {
    // Optionally, you can use req.user info for vendor-specific logic
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories.', type: [OfferCategory] })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, description: 'Return category.', type: OfferCategory })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, ModuleAccessGuard)
  @ModuleAccess('categories')
  @ApiOperation({ summary: 'Update category' })
  @ApiBody({
    schema: {
      example: {
        name: 'Updated Electronics',
        icon: 'updated-icon-url',
        merchantId: 1
      }
    }
  })
  @ApiResponse({ status: 200, description: 'The category has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateOfferCategoryDto, @Request() req) {
    // Optionally, you can use req.user info for vendor-specific logic
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ModuleAccessGuard)
  @ModuleAccess('categories')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'The category has been successfully deleted.' })
  remove(@Param('id') id: string, @Request() req) {
    // Optionally, you can use req.user info for vendor-specific logic
    return this.categoriesService.remove(+id);
  }
}
