import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { WalletTransaction } from '../entity/wallet-transaction.entity';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { WithdrawalRequest } from '../entity/withdrawal-request.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(WalletTransaction)
        private readonly transactionRepository: Repository<WalletTransaction>,
        @InjectRepository(WithdrawalRequest)
        private readonly withdrawalRepository: Repository<WithdrawalRequest>,
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

    async requestWithdraw(userId: number, dto: WithdrawDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const amount = Number(dto.amount);
        if (amount <= 0) throw new BadRequestException('Amount must be greater than 0');
        if (Number(user.walletBalance) < amount) {
            throw new BadRequestException('Insufficient wallet balance');
        }

        const request = this.withdrawalRepository.create({
            amount,
            status: 'pending',
            description: dto.description,
            user,
        });
        return await this.withdrawalRepository.save(request);
    }

    async getWithdrawRequests(userId: number, role: 'admin'|'vendor'|'user') {
        if (role === 'admin') {
            return await this.withdrawalRepository.find({ order: { createdAt: 'DESC' } });
        }
        return await this.withdrawalRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async approveWithdraw(id: number, adminId: number, role: 'admin'|'vendor'|'user') {
        if (role !== 'admin') throw new ForbiddenException('Only admin can approve withdrawals');
        const req = await this.withdrawalRepository.findOne({ where: { id }, relations: ['user'] });
        if (!req) throw new NotFoundException('Withdrawal request not found');
        if (req.status !== 'pending') throw new BadRequestException('Request is not pending');
        req.status = 'approved';
        return await this.withdrawalRepository.save(req);
    }

    async rejectWithdraw(id: number, adminId: number, role: 'admin'|'vendor'|'user') {
        if (role !== 'admin') throw new ForbiddenException('Only admin can reject withdrawals');
        const req = await this.withdrawalRepository.findOne({ where: { id } });
        if (!req) throw new NotFoundException('Withdrawal request not found');
        if (req.status !== 'pending') throw new BadRequestException('Request is not pending');
        req.status = 'rejected';
        return await this.withdrawalRepository.save(req);
    }

    async processWithdraw(id: number, adminId: number, role: 'admin'|'vendor'|'user') {
        if (role !== 'admin') throw new ForbiddenException('Only admin can process withdrawals');
        const req = await this.withdrawalRepository.findOne({ where: { id }, relations: ['user'] });
        if (!req) throw new NotFoundException('Withdrawal request not found');
        if (req.status !== 'approved') throw new BadRequestException('Request must be approved before processing');

        const user = req.user;
        // Deduct balance
        user.walletBalance = Number(user.walletBalance) - Number(req.amount);
        await this.userRepository.save(user);

        // Record transaction
        const txn = this.transactionRepository.create({
            amount: req.amount,
            type: 'withdrawal',
            description: 'Withdrawal processed',
            user,
        });
        await this.transactionRepository.save(txn);

        req.status = 'processed';
        return await this.withdrawalRepository.save(req);
    }
}
