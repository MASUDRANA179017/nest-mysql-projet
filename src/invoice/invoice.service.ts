import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from 'src/entity/invoice.entity';
import { User } from 'src/entity/user.entity';
import { Store } from 'src/entity/store.entity';
import { Order } from 'src/entity/order.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Store)
        private storeRepository: Repository<Store>,

        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) {}

    // Generate unique invoice number
    private generateInvoiceNumber(): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `INV-${timestamp}-${random}`;
    }

    // CREATE
    async create(dto: CreateInvoiceDto, userId: number): Promise<Invoice> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new ForbiddenException('User not found');
        }

        // Verify store ownership
        const store = await this.storeRepository.findOne({
            where: { id: dto.storeId, owner: { id: userId } }
        });
        if (!store) {
            throw new ForbiddenException('Store not found or you are not the owner');
        }

        // Find customer
        const customer = await this.userRepository.findOneBy({ id: dto.customerId });
        if (!customer) {
            throw new ForbiddenException('Customer not found');
        }

        // Find order if provided
        let order: Order | undefined = undefined;
        if (dto.orderId) {
            const foundOrder = await this.orderRepository.findOneBy({ id: dto.orderId });
            if (!foundOrder) {
                throw new ForbiddenException('Order not found');
            }
            order = foundOrder;
        }

        // Calculate total
        const taxAmount = dto.taxAmount || 0;
        const discountAmount = dto.discountAmount || 0;
        const totalAmount = dto.subtotal + taxAmount - discountAmount;

        const invoice = new Invoice();
        invoice.invoiceNumber = this.generateInvoiceNumber();
        invoice.customer = customer;
        invoice.store = store;
        if (order) invoice.order = order;
        invoice.subtotal = dto.subtotal;
        invoice.taxAmount = taxAmount;
        invoice.discountAmount = discountAmount;
        invoice.totalAmount = totalAmount;
        if (dto.notes) invoice.notes = dto.notes;
        if (dto.dueDate) invoice.dueDate = new Date(dto.dueDate);

        return this.invoiceRepository.save(invoice);
    }

    // GET ALL (by store owner)
    async getAll(userId: number): Promise<Invoice[]> {
        const store = await this.storeRepository.findOne({
            where: { owner: { id: userId } }
        });

        if (!store) {
            throw new ForbiddenException('Store not found or you are not the owner');
        }

        return this.invoiceRepository.find({
            where: { store: { id: store.id } },
            relations: ['customer', 'store', 'order'],
            order: { createdAt: 'DESC' },
        });
    }

    // GET BY ID
    async getById(id: number): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: ['customer', 'store', 'order'],
        });

        if (!invoice) {
            throw new NotFoundException(`Invoice with id ${id} not found`);
        }

        return invoice;
    }

    // GET BY INVOICE NUMBER
    async getByInvoiceNumber(invoiceNumber: string): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOne({
            where: { invoiceNumber },
            relations: ['customer', 'store', 'order'],
        });

        if (!invoice) {
            throw new NotFoundException(`Invoice ${invoiceNumber} not found`);
        }

        return invoice;
    }

    // UPDATE
    async update(id: number, dto: UpdateInvoiceDto): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: ['customer', 'store', 'order'],
        });

        if (!invoice) {
            throw new NotFoundException(`Invoice with id ${id} not found`);
        }

        if (dto.taxAmount !== undefined) invoice.taxAmount = dto.taxAmount;
        if (dto.discountAmount !== undefined) invoice.discountAmount = dto.discountAmount;
        if (dto.notes !== undefined) invoice.notes = dto.notes;
        if (dto.dueDate) invoice.dueDate = new Date(dto.dueDate);
        if (dto.status) {
            invoice.status = dto.status;
            if (dto.status === InvoiceStatus.PAID) {
                invoice.paidAt = new Date();
            }
        }

        // Recalculate total
        invoice.totalAmount = Number(invoice.subtotal) + Number(invoice.taxAmount) - Number(invoice.discountAmount);

        return this.invoiceRepository.save(invoice);
    }

    // MARK AS PAID
    async markAsPaid(id: number): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOneBy({ id });
        if (!invoice) {
            throw new NotFoundException(`Invoice with id ${id} not found`);
        }

        invoice.status = InvoiceStatus.PAID;
        invoice.paidAt = new Date();

        return this.invoiceRepository.save(invoice);
    }

    // DELETE
    async delete(id: number): Promise<void> {
        const result = await this.invoiceRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Invoice with id ${id} not found`);
        }
    }

    // GET CUSTOMER INVOICES
    async getCustomerInvoices(customerId: number): Promise<Invoice[]> {
        return this.invoiceRepository.find({
            where: { customer: { id: customerId } },
            relations: ['customer', 'store', 'order'],
            order: { createdAt: 'DESC' },
        });
    }
}
