import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';

@ApiTags('category')
@Controller('/category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    // Vendor Specific Endpoints (Placed first to avoid conflicts)

    @Post('/vendor/create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new category for vendor store' })
    async createVendorCategory(@Request() req, @Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.createForVendor(req.user.id, createCategoryDto);
    }

    @Put('/vendor/update/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a vendor category' })
    async updateVendorCategory(@Request() req, @Param('id') id: string, @Body() updateCategoryDto: CreateCategoryDto) {
        return this.categoryService.updateForVendor(req.user.id, parseInt(id), updateCategoryDto);
    }

    @Delete('/vendor/delete/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a vendor category' })
    async deleteVendorCategory(@Request() req, @Param('id') id: string) {
        return this.categoryService.deleteForVendor(req.user.id, parseInt(id));
    }

    @Get('/vendor/my-categories')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all categories for the logged-in vendor' })
    async getVendorCategories(@Request() req) {
        return this.categoryService.getVendorCategories(req.user.id);
    }

    // Standard Endpoints

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({
        status: 201,
        description: 'Category created successfully',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
    })
    @ApiResponse({
        status: 201,
        description: 'Category created successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }


    @Get('/all')
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({
        status: 200,
        description: 'List of all categories',
    })
    async getAll() {
        return this.categoryService.getAllCategories();
    }

    @Get('/type/:type')
    @ApiOperation({ summary: 'Get categories by type (store or product)' })
    @ApiResponse({
        status: 200,
        description: 'List of categories by type',
    })
    async getByType(@Param('type') type: string) {
        return this.categoryService.getCategoriesByType(type);
    }

    @Get('/store/:storeId')
    @ApiOperation({ summary: 'Get categories by store ID' })
    @ApiResponse({
        status: 200,
        description: 'List of categories for a specific store',
    })
    async getByStore(@Param('storeId') storeId: string) {
        return this.categoryService.getCategoriesByStore(parseInt(storeId));
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiResponse({
        status: 200,
        description: 'Category found',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 404,
        description: 'Category not found',
    })
    async getById(@Param('id') id: string) {
        const categoryId = parseInt(id);
        return this.categoryService.getCategoryById(categoryId);
    }



    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an existing category' })
    @ApiResponse({
        status: 200,
        description: 'Category updated successfully',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 404,
        description: 'Category not found',
    })
    async update(@Param('id') id: string, @Body() updateCategoryDto: CreateCategoryDto) {
        const categoryId = parseInt(id);
        return this.categoryService.update(categoryId, updateCategoryDto);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a category' })

    @ApiResponse({
        status: 200,
        description: 'Category deleted successfully',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 404,
        description: 'Category not found',
    })
    async delete(@Param('id') id: string) {
        const categoryId = parseInt(id);
        return this.categoryService.delete(categoryId);
    }
}
