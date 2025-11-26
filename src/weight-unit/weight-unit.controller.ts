import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { WeightUnitService } from './weight-unit.service';
import { CreateWeightUnitDto } from './dto/create-weight-unit.dto';
import { UpdateWeightUnitDto } from './dto/update-weight-unit.dto';

@Controller('weight-units')
export class WeightUnitController {
    constructor(private readonly weightUnitService: WeightUnitService) {}

    @Post()
    create(@Body() createDto: CreateWeightUnitDto) {
        return this.weightUnitService.create(createDto);
    }

    @Get()
    getAll() {
        return this.weightUnitService.getAll();
    }

    @Get(':id')
    getById(@Param('id') id: number) {
        return this.weightUnitService.getById(id);
    }

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() updateDto: UpdateWeightUnitDto,
    ) {
        return this.weightUnitService.update(id, updateDto);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.weightUnitService.delete(id);
    }
}
