import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all payment transactions' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment transaction by id' })
  @ApiResponse({ status: 200 })
  findOne(@Param('id') id: number) {
    return this.paymentService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment transaction' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update payment transaction' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: number, @Body() dto: CreatePaymentDto) {
    return this.paymentService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete payment transaction' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: number) {
    return this.paymentService.remove(id);
  }
}
