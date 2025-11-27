import { Body, Controller, Get, Param, Post, Put, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';

@ApiTags('prescriptions')
@Controller('prescriptions')
export class PrescriptionController {
    constructor(private readonly prescriptionService: PrescriptionService) {}

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new prescription for a pet owner' })
    @ApiResponse({ status: 201, description: 'Prescription created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async createPrescription(
        @Body() prescriptionDto: CreatePrescriptionDto,
        @Request() req: any
    ) {
        return this.prescriptionService.create(prescriptionDto, req.user.id);
    }

    @Get('/all')
    @ApiOperation({ summary: 'Get all prescriptions' })
    async getAll() {
        return this.prescriptionService.getAll();
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a prescription by ID' })
    async getById(@Param('id', ParseIntPipe) id: number) {
        return this.prescriptionService.getById(id);
    }

    @Put('/update/:id')
    @ApiOperation({ summary: 'Update a prescription' })
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePrescriptionDto) {
        return this.prescriptionService.update(id, dto);
    }

    @Delete('/delete/:id')
    @ApiOperation({ summary: 'Delete a prescription' })
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.prescriptionService.delete(id);
    }
}
