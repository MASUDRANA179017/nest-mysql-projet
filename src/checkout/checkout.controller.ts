import { CheckoutService } from './checkout.service';
import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('order')
@Controller('checkout')
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) { }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'Order created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
        return this.checkoutService.createOrder(createOrderDto, req.user.id);
    }


    @Get('all-order')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get all orders" })
    @ApiResponse({ status: 200, description: "All orders retrieved successfully" })
    @ApiResponse({ status: 400, description: "Bad Request" })
    async getAllOrders() {
        return this.checkoutService.getAllOrders();
    }

    @Get('vendor-orders')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get logged-in vendor's orders" })
    async getVendorOrders(@Request() req: any) {
        return this.checkoutService.getVendorOrders(req.user.id);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update order status' })
    @ApiResponse({ status: 200, description: 'Order status updated successfully.' })
    @ApiResponse({ status: 404, description: 'Order not found.' })
    async updateOrderStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: string,
    ) {
        console.log(`[Controller] Updating Order ID: ${id} to Status: ${status}`);
        return this.checkoutService.updateOrderStatus(id, status);
    }

    @Get('availability')
    @ApiOperation({ summary: "Get booked times for a product on a date" })
    @ApiResponse({ status: 200, description: "Booked times retrieved successfully" })
    async getAvailability(
        @Query('productId', ParseIntPipe) productId: number,
        @Query('date') date: string
    ) {
        return this.checkoutService.getAvailability(productId, date);
    }
}
