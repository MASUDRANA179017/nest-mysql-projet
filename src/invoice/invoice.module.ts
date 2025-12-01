import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { Invoice } from 'src/entity/invoice.entity';
import { User } from 'src/entity/user.entity';
import { Store } from 'src/entity/store.entity';
import { Order } from 'src/entity/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, User, Store, Order])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}

