import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { WalletTransaction } from '../entity/wallet-transaction.entity';
import { DepositDto } from './dto/deposit.dto';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(WalletTransaction)
        private readonly transactionRepository: Repository<WalletTransaction>,
    ) {}

    async getBalance(userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        return { balance: user.walletBalance };
    }

    async getTransactions(userId: number) {
        return await this.transactionRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async deposit(userId: number, depositDto: DepositDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        // Update balance
        user.walletBalance = Number(user.walletBalance) + Number(depositDto.amount);
        await this.userRepository.save(user);

        // Create transaction
        const transaction = this.transactionRepository.create({
            amount: depositDto.amount,
            type: 'deposit',
            description: depositDto.description || 'Deposit funds',
            user: user,
        });
        await this.transactionRepository.save(transaction);

        return { message: 'Deposit successful', balance: user.walletBalance };
    }
}
