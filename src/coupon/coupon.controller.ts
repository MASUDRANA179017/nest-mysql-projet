import { CouponService } from './coupon.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@ApiTags('coupon')
@Controller('coupon')
export class CouponController {
    constructor(private readonly couponService: CouponService) { }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new coupon' })
        @ApiBody({
            type: CreateCouponDto,
            schema: {
                example: {
                    code: 'SUMMER2025',
                    discountType: 'PERCENTAGE',
                    discountValue: 20,
                    scope: 'PRODUCT',
                    storeId: 1,
                    productIds: [1, 2],
                    categoryIds: [3, 4],
                    expiresAt: '2026-12-31T23:59:59Z',
                    userId: 1
                }
            }
        })
    @ApiResponse({ status: 201, description: 'Coupon created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'You are not the store owner' })
    @ApiResponse({ status: 404, description: 'Store, Product or Category not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async createCoupon(@Body() createCouponDto: CreateCouponDto, @Request() req: any) {
        return this.couponService.create(createCouponDto, req.user.id);
    }

    @Post('apply')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Apply coupon code' })
        @ApiBody({
            type: ApplyCouponDto,
            schema: {
                example: {
                    code: 'SUMMER2025',
                    storeId: 1,
                    items: [
                        { productId: 1, price: 100, quantity: 2 },
                        { productId: 2, price: 50, quantity: 1 }
                    ]
                }
            }
        })
    @ApiResponse({ status: 200, description: 'Coupon applied successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid coupon or not applicable.' })
    async applyCoupon(@Body() applyCouponDto: ApplyCouponDto) {
        return this.couponService.applyCoupon(applyCouponDto);
    }

    @Get('all-coupon')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get all coupon code" })
    @ApiResponse({ status: 201, description: "All Coupon code get successfully" })
    @ApiResponse({ status: 400, description: "Bad Request" })
    async getCoupon(@Request() req: any) {
        return this.couponService.getAllCoupons(req.user.id);
    }
    @Get('getById/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: "Get Coupon by ID"})
    @ApiResponse({status:200, description:"Coupon fetched successfully"})
    @ApiResponse({status:401, description:"Unauthorized"})
    @ApiResponse({status: 500, description:"Internal serve error "})
    async getCouponById(@Param("id") id: string){
        return this.couponService.getCouponById(+id)
    }


    @Put('update-coupon/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: "Update Coupon by ID"})
        @ApiBody({
            type: UpdateCouponDto,
            schema: {
                example: {
                    code: 'WINTER2025',
                    discountType: 'FIXED',
                    discountValue: 100,
                    scope: 'CATEGORY',
                    storeId: 2,
                    categoryIds: [5, 6],
                    expiresAt: '2027-01-31T23:59:59Z',
                    userId: 2
                }
            }
        })
    @ApiResponse({status:200, description:"Coupon Update successfully"})
    @ApiResponse({status:401, description:"Unauthorized"})
    @ApiResponse({status: 500, description:"Internal serve error "})
    async updateCoupon(@Param("id") id: string, @Body() updateCouponDto: UpdateCouponDto, @Request() req: any){
        return this.couponService.updateCoupon(+id, updateCouponDto, req.user.id)
    }

    @Delete("delete/:id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete Coupon by ID" })
    @ApiResponse({
        status: 200,
        description: "Coupon deleted successfully",
    })
    async deleteCoupon(@Param("id") id: string, @Request() req: any) {
        return this.couponService.deleteCoupon(+id, req.user.id);
    }
}
