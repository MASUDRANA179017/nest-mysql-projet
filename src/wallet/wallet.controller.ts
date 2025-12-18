import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DepositDto } from './dto/deposit.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';

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
}
