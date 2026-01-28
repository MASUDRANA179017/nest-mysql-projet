import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { WeightUnitService } from './weight-unit.service';
import { CreateWeightUnitDto } from './dto/create-weight-unit.dto';
import { UpdateWeightUnitDto } from './dto/update-weight-unit.dto';

@ApiTags('weight-unit')
@Controller('weight-unit')
export class WeightUnitController {
    constructor(private readonly weightUnitService: WeightUnitService) {}

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new weight unit' })
    @ApiBody({
        schema: {
            example: {
                name: 'Kilogram',
                description: 'Used for heavy products'
            }
        }
    })
    @ApiResponse({ status: 201, description: 'Weight unit created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(@Body() createWeightUnitDto: CreateWeightUnitDto) {
        return this.weightUnitService.create(createWeightUnitDto);
    }

    @Get('/all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all weight units' })
    @ApiResponse({ status: 200, description: 'List of all weight units' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getAll() {
        return this.weightUnitService.getAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a weight unit by ID' })
    @ApiResponse({ status: 200, description: 'Weight unit found' })
    @ApiResponse({ status: 404, description: 'Weight unit not found' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async getById(@Param('id') id: string) {
        const unitId = parseInt(id);
        return this.weightUnitService.getById(unitId);
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an existing weight unit' })
    @ApiBody({
        schema: {
            example: {
                name: 'Gram',
                description: 'Used for small products'
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Weight unit updated successfully' })
    @ApiResponse({ status: 404, description: 'Weight unit not found' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async update(@Param('id') id: string, @Body() updateWeightUnitDto: UpdateWeightUnitDto) {
        const unitId = parseInt(id);
        return this.weightUnitService.update(unitId, updateWeightUnitDto);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a weight unit' })
    @ApiResponse({ status: 200, description: 'Weight unit deleted successfully' })
    @ApiResponse({ status: 404, description: 'Weight unit not found' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async delete(@Param('id') id: string) {
        const unitId = parseInt(id);
        return this.weightUnitService.delete(unitId);
    }
}
