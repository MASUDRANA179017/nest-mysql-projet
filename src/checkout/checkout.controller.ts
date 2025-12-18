import { CheckoutService } from './checkout.service';
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
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
}
