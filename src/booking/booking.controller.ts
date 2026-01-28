import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by id' })
  @ApiResponse({ status: 200 })
  findOne(@Param('id') id: number) {
    return this.bookingService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create booking' })
  @ApiBody({
    schema: {
      example: {
        userId: 1,
        service: 'Room Cleaning',
        bookingDate: '2026-01-29T10:00:00Z',
        status: 'pending',
        createdAt: '2026-01-29T09:00:00Z'
      }
    }
  })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking' })
  @ApiBody({
    schema: {
      example: {
        userId: 1,
        service: 'Room Cleaning',
        bookingDate: '2026-01-29T10:00:00Z',
        status: 'confirmed',
        createdAt: '2026-01-29T09:00:00Z'
      }
    }
  })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: number, @Body() dto: CreateBookingDto) {
    return this.bookingService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete booking' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: number) {
    return this.bookingService.remove(id);
  }
}
