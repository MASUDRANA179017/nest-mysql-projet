import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { User } from '../entity/user.entity';
import { WalletTransaction } from '../entity/wallet-transaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, WalletTransaction])],
    controllers: [WalletController],
    providers: [WalletService],
    exports: [WalletService],
})
export class WalletModule {}
