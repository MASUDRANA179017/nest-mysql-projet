import { Body, Controller, Get, Param, Post, Put, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';

@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new invoice' })
    @ApiResponse({ status: 201, description: 'Invoice created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createInvoice(
        @Body() dto: CreateInvoiceDto,
        @Request() req: any
    ) {
        return this.invoiceService.create(dto, req.user.id);
    }

    @Get('/all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all invoices for store owner' })
    @ApiResponse({ status: 200, description: 'Invoices retrieved successfully' })
    async getAll(@Request() req: any) {
        return this.invoiceService.getAll(req.user.id);
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get invoice by ID' })
    async getById(@Param('id', ParseIntPipe) id: number) {
        return this.invoiceService.getById(id);
    }

    @Get('/number/:invoiceNumber')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get invoice by invoice number' })
    async getByInvoiceNumber(@Param('invoiceNumber') invoiceNumber: string) {
        return this.invoiceService.getByInvoiceNumber(invoiceNumber);
    }

    @Get('/customer/:customerId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all invoices for a customer' })
    async getCustomerInvoices(@Param('customerId', ParseIntPipe) customerId: number) {
        return this.invoiceService.getCustomerInvoices(customerId);
    }

    @Put('/update/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update an invoice' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateInvoiceDto
    ) {
        return this.invoiceService.update(id, dto);
    }

    @Put('/mark-paid/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Mark invoice as paid' })
    async markAsPaid(@Param('id', ParseIntPipe) id: number) {
        return this.invoiceService.markAsPaid(id);
    }

    @Delete('/delete/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete an invoice' })
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.invoiceService.delete(id);
    }
}

