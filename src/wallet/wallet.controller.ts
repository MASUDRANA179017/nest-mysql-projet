import { Controller, Get, Post, Body, UseGuards, Request, Param, Put, ParseIntPipe } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DepositDto } from './dto/deposit.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Get('balance')
    async getBalance(@Request() req) {
        return await this.walletService.getBalance(req.user.id);
    }

    @Get('transactions')
    async getTransactions(@Request() req) {
        return await this.walletService.getTransactions(req.user.id);
    }

    @Post('deposit')
    async deposit(@Request() req, @Body() depositDto: DepositDto) {
        return await this.walletService.deposit(req.user.id, depositDto);
    }

    @Post('withdraw/request')
    async requestWithdraw(@Request() req, @Body() withdrawDto: WithdrawDto) {
        return await this.walletService.requestWithdraw(req.user.id, withdrawDto);
    }

    @Get('withdraw/requests')
    async getMyWithdrawRequests(@Request() req) {
        return await this.walletService.getWithdrawRequests(req.user.id, req.user.role);
    }

    @Put('withdraw/:id/approve')
    async approveWithdraw(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return await this.walletService.approveWithdraw(id, req.user.id, req.user.role);
    }

    @Put('withdraw/:id/reject')
    async rejectWithdraw(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return await this.walletService.rejectWithdraw(id, req.user.id, req.user.role);
    }

    @Put('withdraw/:id/process')
    async processWithdraw(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return await this.walletService.processWithdraw(id, req.user.id, req.user.role);
    }
}
