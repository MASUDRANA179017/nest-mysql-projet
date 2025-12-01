import { Controller, Get, Param, ParseIntPipe, Query, Res, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { BarcodeService, BarcodeType } from './barcode.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';

@ApiTags('barcode')
@Controller('barcode')
export class BarcodeController {
    constructor(private readonly barcodeService: BarcodeService) {}

    // ==================== QR CODE ENDPOINTS ====================

    @Get('/qr/product/:productId')
    @ApiOperation({ summary: 'Generate QR code for a product (returns base64)' })
    @ApiResponse({ status: 200, description: 'QR code generated successfully' })
    async getProductQRCode(@Param('productId', ParseIntPipe) productId: number) {
        const qrCode = await this.barcodeService.generateProductQRCode(productId);
        return { productId, qrCode };
    }

    @Get('/qr/product/:productId/download')
    @ApiOperation({ summary: 'Download QR code as PNG file' })
    async downloadProductQRCode(
        @Param('productId', ParseIntPipe) productId: number,
        @Res() res: Response
    ) {
        const buffer = await this.barcodeService.generateProductQRCodeBuffer(productId);
        
        res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="qr-product-${productId}.png"`,
            'Content-Length': buffer.length,
        });
        
        res.send(buffer);
    }

    @Post('/qr/custom')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Generate custom QR code with any data' })
    async generateCustomQRCode(@Body('data') data: string) {
        const qrCode = await this.barcodeService.generateCustomQRCode(data);
        return { qrCode };
    }

    // ==================== BARCODE ENDPOINTS ====================

    @Get('/barcode/product/:productId')
    @ApiOperation({ summary: 'Generate barcode for a product (returns base64)' })
    @ApiQuery({ name: 'type', enum: BarcodeType, required: false, description: 'Barcode type (default: code128)' })
    async getProductBarcode(
        @Param('productId', ParseIntPipe) productId: number,
        @Query('type') type?: BarcodeType
    ) {
        const barcode = await this.barcodeService.generateProductBarcode(
            productId,
            type || BarcodeType.CODE128
        );
        return { productId, barcodeType: type || BarcodeType.CODE128, barcode };
    }

    @Get('/barcode/product/:productId/download')
    @ApiOperation({ summary: 'Download barcode as PNG file' })
    @ApiQuery({ name: 'type', enum: BarcodeType, required: false })
    async downloadProductBarcode(
        @Param('productId', ParseIntPipe) productId: number,
        @Query('type') type: BarcodeType,
        @Res() res: Response
    ) {
        const buffer = await this.barcodeService.generateProductBarcodeBuffer(
            productId,
            type || BarcodeType.CODE128
        );
        
        res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="barcode-product-${productId}.png"`,
            'Content-Length': buffer.length,
        });
        
        res.send(buffer);
    }

    @Post('/barcode/custom')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Generate custom barcode with any text' })
    @ApiQuery({ name: 'type', enum: BarcodeType, required: false })
    async generateCustomBarcode(
        @Body('text') text: string,
        @Query('type') type?: BarcodeType
    ) {
        const barcode = await this.barcodeService.generateCustomBarcode(
            text,
            type || BarcodeType.CODE128
        );
        return { barcodeType: type || BarcodeType.CODE128, barcode };
    }

    // ==================== COMBINED ENDPOINTS ====================

    @Get('/product/:productId')
    @ApiOperation({ summary: 'Get product with both QR code and barcode' })
    async getProductWithCodes(@Param('productId', ParseIntPipe) productId: number) {
        return this.barcodeService.getProductWithCodes(productId);
    }

    @Post('/bulk')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Generate QR and barcodes for multiple products' })
    async bulkGenerateCodes(@Body('productIds') productIds: number[]) {
        return this.barcodeService.bulkGenerateCodes(productIds);
    }

    // ==================== BARCODE TYPES INFO ====================

    @Get('/types')
    @ApiOperation({ summary: 'Get available barcode types' })
    async getBarcodeTypes() {
        return {
            types: [
                { value: BarcodeType.CODE128, name: 'Code 128', description: 'General purpose, alphanumeric' },
                { value: BarcodeType.CODE39, name: 'Code 39', description: 'Alphanumeric, commonly used' },
                { value: BarcodeType.EAN13, name: 'EAN-13', description: 'European Article Number, 13 digits' },
                { value: BarcodeType.EAN8, name: 'EAN-8', description: 'Short EAN, 8 digits' },
                { value: BarcodeType.UPC, name: 'UPC-A', description: 'Universal Product Code, 12 digits' },
                { value: BarcodeType.ITF14, name: 'ITF-14', description: 'Interleaved 2 of 5, 14 digits' },
            ],
        };
    }
}

