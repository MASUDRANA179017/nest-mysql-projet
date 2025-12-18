import { Body, Controller, Get, Param, Post, Put, ParseIntPipe, UseGuards, Request, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PosService } from './pos.service';
import { OpenSessionDto } from './dto/open-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { RefundTransactionDto } from './dto/refund-transaction.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';

@ApiTags('pos')
@Controller('pos')
export class PosController {
    constructor(private readonly posService: PosService) {}

    // ==================== SESSION ENDPOINTS ====================

    @Post('/session/open')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Open a new POS session (cash register)' })
    @ApiResponse({ status: 201, description: 'Session opened successfully' })
    async openSession(@Body() dto: OpenSessionDto, @Request() req: any) {
        return this.posService.openSession(dto, req.user.id);
    }

    @Put('/session/close/:sessionId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Close a POS session' })
    async closeSession(
        @Param('sessionId', ParseIntPipe) sessionId: number,
        @Body() dto: CloseSessionDto,
        @Request() req: any
    ) {
        return this.posService.closeSession(sessionId, dto, req.user.id);
    }

    @Get('/session/active/:storeId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get active session for a store' })
    async getActiveSession(@Param('storeId', ParseIntPipe) storeId: number) {
        return this.posService.getActiveSession(storeId);
    }

    @Get('/session/:sessionId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get session by ID' })
    async getSessionById(@Param('sessionId', ParseIntPipe) sessionId: number) {
        return this.posService.getSessionById(sessionId);
    }

    @Get('/sessions/store/:storeId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all sessions for a store' })
    async getStoreSessions(@Param('storeId', ParseIntPipe) storeId: number) {
        return this.posService.getStoreSessions(storeId);
    }

    // ==================== TRANSACTION ENDPOINTS ====================

    @Post('/transaction/create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new sale transaction' })
    @ApiResponse({ status: 201, description: 'Transaction created successfully' })
    async createTransaction(@Body() dto: CreateTransactionDto, @Request() req: any) {
        return this.posService.createTransaction(dto, req.user.id);
    }

    @Get('/transaction/:transactionId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get transaction by ID' })
    async getTransactionById(@Param('transactionId', ParseIntPipe) transactionId: number) {
        return this.posService.getTransactionById(transactionId);
    }

    @Get('/transaction/number/:transactionNumber')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get transaction by transaction number' })
    async getTransactionByNumber(@Param('transactionNumber') transactionNumber: string) {
        return this.posService.getTransactionByNumber(transactionNumber);
    }

    @Get('/transactions/session/:sessionId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all transactions for a session' })
    async getSessionTransactions(@Param('sessionId', ParseIntPipe) sessionId: number) {
        return this.posService.getSessionTransactions(sessionId);
    }

    @Get('/transactions/store/:storeId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all transactions for a store' })
    async getStoreTransactions(@Param('storeId', ParseIntPipe) storeId: number) {
        return this.posService.getStoreTransactions(storeId);
    }

    @Put('/transaction/refund/:transactionId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Refund a transaction' })
    async refundTransaction(
        @Param('transactionId', ParseIntPipe) transactionId: number,
        @Body() dto: RefundTransactionDto
    ) {
        return this.posService.refundTransaction(transactionId, dto.reason);
    }

    @Put('/transaction/void/:transactionId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Void a transaction' })
    async voidTransaction(
        @Param('transactionId', ParseIntPipe) transactionId: number,
        @Body() dto: RefundTransactionDto
    ) {
        return this.posService.voidTransaction(transactionId, dto.reason);
    }

    // ==================== REPORTS ====================

    @Get('/report/daily/:storeId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get daily sales report' })
    async getDailySalesReport(
        @Param('storeId', ParseIntPipe) storeId: number,
        @Query('date') date: string
    ) {
        return this.posService.getDailySalesReport(storeId, date || new Date().toISOString().split('T')[0]);
    }
}

