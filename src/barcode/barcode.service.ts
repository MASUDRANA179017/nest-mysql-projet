import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entity/product.entity';
import * as QRCode from 'qrcode';
import * as bwipjs from 'bwip-js';

export enum BarcodeType {
    CODE128 = 'code128',
    CODE39 = 'code39',
    EAN13 = 'ean13',
    EAN8 = 'ean8',
    UPC = 'upca',
    ITF14 = 'itf14',
}

@Injectable()
export class BarcodeService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    // Generate QR Code for a product (returns base64 image)
    async generateProductQRCode(productId: number): Promise<string> {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['store', 'category', 'brand'],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        // Create QR code data with product info
        const qrData = JSON.stringify({
            id: product.id,
            name: product.name,
            price: product.price,
            sku: `PRD-${product.id.toString().padStart(6, '0')}`,
        });

        // Generate QR code as base64 data URL
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        });

        return qrCodeDataUrl;
    }

    // Generate QR Code as Buffer (for file download)
    async generateProductQRCodeBuffer(productId: number): Promise<Buffer> {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        const qrData = JSON.stringify({
            id: product.id,
            name: product.name,
            price: product.price,
            sku: `PRD-${product.id.toString().padStart(6, '0')}`,
        });

        return QRCode.toBuffer(qrData, {
            width: 300,
            margin: 2,
        });
    }

    // Generate Barcode for a product (returns base64 image)
    async generateProductBarcode(
        productId: number,
        barcodeType: BarcodeType = BarcodeType.CODE128
    ): Promise<string> {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        // Generate SKU-based barcode text
        const barcodeText = this.generateBarcodeText(product.id, barcodeType);

        try {
            const png = await bwipjs.toBuffer({
                bcid: barcodeType,
                text: barcodeText,
                scale: 3,
                height: 10,
                includetext: true,
                textxalign: 'center',
            });

            // Convert to base64 data URL
            const base64 = png.toString('base64');
            return `data:image/png;base64,${base64}`;
        } catch (error) {
            throw new Error(`Failed to generate barcode: ${error.message}`);
        }
    }

    // Generate Barcode as Buffer (for file download)
    async generateProductBarcodeBuffer(
        productId: number,
        barcodeType: BarcodeType = BarcodeType.CODE128
    ): Promise<Buffer> {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        const barcodeText = this.generateBarcodeText(product.id, barcodeType);

        return bwipjs.toBuffer({
            bcid: barcodeType,
            text: barcodeText,
            scale: 3,
            height: 10,
            includetext: true,
            textxalign: 'center',
        });
    }

    // Generate barcode text based on product ID and barcode type
    private generateBarcodeText(productId: number, barcodeType: BarcodeType): string {
        switch (barcodeType) {
            case BarcodeType.EAN13:
                // EAN-13 needs exactly 12 digits (13th is checksum)
                return productId.toString().padStart(12, '0').slice(0, 12);
            case BarcodeType.EAN8:
                // EAN-8 needs exactly 7 digits (8th is checksum)
                return productId.toString().padStart(7, '0').slice(0, 7);
            case BarcodeType.UPC:
                // UPC-A needs exactly 11 digits (12th is checksum)
                return productId.toString().padStart(11, '0').slice(0, 11);
            case BarcodeType.ITF14:
                // ITF-14 needs exactly 13 digits (14th is checksum)
                return productId.toString().padStart(13, '0').slice(0, 13);
            default:
                // CODE128 and CODE39 can handle alphanumeric
                return `PRD${productId.toString().padStart(8, '0')}`;
        }
    }

    // Generate QR Code with custom data
    async generateCustomQRCode(data: string): Promise<string> {
        const qrCodeDataUrl = await QRCode.toDataURL(data, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        });

        return qrCodeDataUrl;
    }

    // Generate Barcode with custom text
    async generateCustomBarcode(
        text: string,
        barcodeType: BarcodeType = BarcodeType.CODE128
    ): Promise<string> {
        try {
            const png = await bwipjs.toBuffer({
                bcid: barcodeType,
                text: text,
                scale: 3,
                height: 10,
                includetext: true,
                textxalign: 'center',
            });

            const base64 = png.toString('base64');
            return `data:image/png;base64,${base64}`;
        } catch (error) {
            throw new Error(`Failed to generate barcode: ${error.message}`);
        }
    }

    // Get product with QR and Barcode data
    async getProductWithCodes(productId: number): Promise<any> {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['store', 'category', 'brand'],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        const [qrCode, barcode] = await Promise.all([
            this.generateProductQRCode(productId),
            this.generateProductBarcode(productId),
        ]);

        return {
            product,
            sku: `PRD-${product.id.toString().padStart(6, '0')}`,
            qrCode,
            barcode,
        };
    }

    // Bulk generate codes for multiple products
    async bulkGenerateCodes(productIds: number[]): Promise<any[]> {
        const results = await Promise.all(
            productIds.map(async (id) => {
                try {
                    return await this.getProductWithCodes(id);
                } catch (error) {
                    return { productId: id, error: error.message };
                }
            })
        );

        return results;
    }
}

