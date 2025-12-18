import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { User } from '../entity/user.entity';
import { WalletTransaction } from '../entity/wallet-transaction.entity';
import { WithdrawalRequest } from '../entity/withdrawal-request.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, WalletTransaction, WithdrawalRequest])],
    controllers: [WalletController],
    providers: [WalletService],
    exports: [WalletService],
})
export class WalletModule {}
