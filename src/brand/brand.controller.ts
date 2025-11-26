import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { BrandService } from "./brand.service";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { JwtAuthGuard } from "src/jwt-auth.guard";

@ApiTags("Brand")
@Controller("brand")

export class BrandController {
    constructor(private readonly brandsService: BrandService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({
      status: 201,
      description: 'Brand created successfully',
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
        description: 'Brand created successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })

    async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }


  @Get('/all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all brands' })
    @ApiResponse({
        status: 200,
        description: 'List of all brands',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getAll() {
        return this.brandsService.getAllBrands();
    }


  @Get(":id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a brand by ID' })
    @ApiResponse({
        status: 200,
        description: 'Brand found',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async findOne(@Param("id") id: number) {
    return this.brandsService.getBrandById(id);
    }

    @Patch("update/:id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a brand by ID' })
    @ApiResponse({
        status: 200,
        description: 'Brand updated successfully',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async update(@Param("id") id: number, @Body() updateBrandDto: UpdateBrandDto) {
    const brandId = Number(id);
    return this.brandsService.update(brandId, updateBrandDto);
  }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a brand by ID' })
    @ApiResponse({
        status: 200,
        description: 'Brand deleted successfully',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async remove(@Param("id") id: number) {
        const brandId = Number(id);
        return this.brandsService.delete(brandId);
    }
}
