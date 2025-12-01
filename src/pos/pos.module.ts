import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';
import { PosSession } from 'src/entity/pos-session.entity';
import { PosTransaction } from 'src/entity/pos-transaction.entity';
import { User } from 'src/entity/user.entity';
import { Store } from 'src/entity/store.entity';
import { Product } from 'src/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PosSession, PosTransaction, User, Store, Product])],
  controllers: [PosController],
  providers: [PosService],
  exports: [PosService],
})
export class PosModule {}

