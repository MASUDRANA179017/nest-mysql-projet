import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PosSession, SessionStatus } from 'src/entity/pos-session.entity';
import { PosTransaction, PaymentMethod, TransactionStatus, PosTransactionItem } from 'src/entity/pos-transaction.entity';
import { User } from 'src/entity/user.entity';
import { Store } from 'src/entity/store.entity';
import { Product } from 'src/entity/product.entity';
import { OpenSessionDto } from './dto/open-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class PosService {
    constructor(
        @InjectRepository(PosSession)
        private sessionRepository: Repository<PosSession>,

        @InjectRepository(PosTransaction)
        private transactionRepository: Repository<PosTransaction>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Store)
        private storeRepository: Repository<Store>,

        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    // Generate unique transaction number
    private generateTransactionNumber(): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `TXN-${timestamp}-${random}`;
    }

    // ==================== SESSION OPERATIONS ====================

    // Open a new POS session
    async openSession(dto: OpenSessionDto, userId: number): Promise<PosSession> {
        const cashier = await this.userRepository.findOneBy({ id: userId });
        if (!cashier) {
            throw new ForbiddenException('User not found');
        }

        // Verify store ownership or cashier access
        const store = await this.storeRepository.findOne({
            where: { id: dto.storeId },
            relations: ['owner'],
        });
        if (!store) {
            throw new NotFoundException('Store not found');
        }

        // Check if there's already an open session for this store
        const existingSession = await this.sessionRepository.findOne({
            where: { store: { id: dto.storeId }, status: SessionStatus.OPEN },
        });
        if (existingSession) {
            throw new BadRequestException('There is already an open session for this store');
        }

        const session = new PosSession();
        session.store = store;
        session.cashier = cashier;
        session.openingBalance = dto.openingBalance;
        session.status = SessionStatus.OPEN;

        return this.sessionRepository.save(session);
    }

    // Close a POS session
    async closeSession(sessionId: number, dto: CloseSessionDto, userId: number): Promise<PosSession> {
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId },
            relations: ['cashier', 'store'],
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        if (session.status === SessionStatus.CLOSED) {
            throw new BadRequestException('Session is already closed');
        }

        session.closingBalance = dto.closingBalance;
        if (dto.closingNotes) {
            session.closingNotes = dto.closingNotes;
        }
        session.status = SessionStatus.CLOSED;
        session.closedAt = new Date();

        return this.sessionRepository.save(session);
    }

    // Get active session for a store
    async getActiveSession(storeId: number): Promise<PosSession> {
        const session = await this.sessionRepository.findOne({
            where: { store: { id: storeId }, status: SessionStatus.OPEN },
            relations: ['cashier', 'store', 'transactions'],
        });

        if (!session) {
            throw new NotFoundException('No active session found for this store');
        }

        return session;
    }

    // Get session by ID
    async getSessionById(sessionId: number): Promise<PosSession> {
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId },
            relations: ['cashier', 'store', 'transactions'],
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        return session;
    }

    // Get all sessions for a store
    async getStoreSessions(storeId: number): Promise<PosSession[]> {
        return this.sessionRepository.find({
            where: { store: { id: storeId } },
            relations: ['cashier', 'store'],
            order: { openedAt: 'DESC' },
        });
    }

    // ==================== TRANSACTION OPERATIONS ====================

    // Create a new POS transaction (sale)
    async createTransaction(dto: CreateTransactionDto, userId: number): Promise<PosTransaction> {
        const cashier = await this.userRepository.findOneBy({ id: userId });
        if (!cashier) {
            throw new ForbiddenException('User not found');
        }

        // Get the session
        const session = await this.sessionRepository.findOne({
            where: { id: dto.sessionId },
            relations: ['store'],
        });
        if (!session) {
            throw new NotFoundException('Session not found');
        }

        if (session.status === SessionStatus.CLOSED) {
            throw new BadRequestException('Cannot create transaction in a closed session');
        }

        // Get customer if provided
        let customer: User | undefined = undefined;
        if (dto.customerId) {
            const foundCustomer = await this.userRepository.findOneBy({ id: dto.customerId });
            if (foundCustomer) {
                customer = foundCustomer;
            }
        }

        // Process items and calculate totals
        const transactionItems: PosTransactionItem[] = [];
        let subtotal = 0;

        for (const item of dto.items) {
            const product = await this.productRepository.findOneBy({ id: item.productId });
            if (!product) {
                throw new NotFoundException(`Product with ID ${item.productId} not found`);
            }

            // Check stock
            if (product.stock < item.quantity) {
                throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
            }

            const totalPrice = product.price * item.quantity;
            subtotal += totalPrice;

            transactionItems.push({
                productId: product.id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.price,
                totalPrice,
            });

            // Deduct stock
            product.stock -= item.quantity;
            await this.productRepository.save(product);
        }

        const taxAmount = dto.taxAmount || 0;
        const discountAmount = dto.discountAmount || 0;
        const totalAmount = subtotal + taxAmount - discountAmount;
        const changeAmount = dto.amountPaid - totalAmount;

        if (changeAmount < 0) {
            throw new BadRequestException('Insufficient payment amount');
        }

        const transaction = new PosTransaction();
        transaction.transactionNumber = this.generateTransactionNumber();
        transaction.store = session.store;
        transaction.cashier = cashier;
        if (customer) transaction.customer = customer;
        transaction.session = session;
        transaction.items = transactionItems;
        transaction.subtotal = subtotal;
        transaction.taxAmount = taxAmount;
        transaction.discountAmount = discountAmount;
        transaction.totalAmount = totalAmount;
        transaction.paymentMethod = dto.paymentMethod;
        transaction.amountPaid = dto.amountPaid;
        transaction.changeAmount = changeAmount;
        if (dto.notes) transaction.notes = dto.notes;
        transaction.status = TransactionStatus.COMPLETED;

        const savedTransaction = await this.transactionRepository.save(transaction);

        // Update session totals
        session.totalSales = Number(session.totalSales) + totalAmount;
        session.transactionCount += 1;
        
        if (dto.paymentMethod === PaymentMethod.CASH) {
            session.totalCashSales = Number(session.totalCashSales) + totalAmount;
        } else if (dto.paymentMethod === PaymentMethod.CARD) {
            session.totalCardSales = Number(session.totalCardSales) + totalAmount;
        }

        await this.sessionRepository.save(session);

        return savedTransaction;
    }

    // Get transaction by ID
    async getTransactionById(transactionId: number): Promise<PosTransaction> {
        const transaction = await this.transactionRepository.findOne({
            where: { id: transactionId },
            relations: ['cashier', 'customer', 'store', 'session'],
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return transaction;
    }

    // Get transaction by number
    async getTransactionByNumber(transactionNumber: string): Promise<PosTransaction> {
        const transaction = await this.transactionRepository.findOne({
            where: { transactionNumber },
            relations: ['cashier', 'customer', 'store', 'session'],
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return transaction;
    }

    // Get all transactions for a session
    async getSessionTransactions(sessionId: number): Promise<PosTransaction[]> {
        return this.transactionRepository.find({
            where: { session: { id: sessionId } },
            relations: ['cashier', 'customer'],
            order: { createdAt: 'DESC' },
        });
    }

    // Refund a transaction
    async refundTransaction(transactionId: number, reason?: string): Promise<PosTransaction> {
        const transaction = await this.transactionRepository.findOne({
            where: { id: transactionId },
            relations: ['session'],
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        if (transaction.status === TransactionStatus.REFUNDED) {
            throw new BadRequestException('Transaction is already refunded');
        }

        if (transaction.status === TransactionStatus.VOIDED) {
            throw new BadRequestException('Cannot refund a voided transaction');
        }

        // Restore stock
        for (const item of transaction.items) {
            const product = await this.productRepository.findOneBy({ id: item.productId });
            if (product) {
                product.stock += item.quantity;
                await this.productRepository.save(product);
            }
        }

        // Update session totals
        const session = transaction.session;
        if (session) {
            session.totalSales = Number(session.totalSales) - Number(transaction.totalAmount);
            session.transactionCount -= 1;
            
            if (transaction.paymentMethod === PaymentMethod.CASH) {
                session.totalCashSales = Number(session.totalCashSales) - Number(transaction.totalAmount);
            } else if (transaction.paymentMethod === PaymentMethod.CARD) {
                session.totalCardSales = Number(session.totalCardSales) - Number(transaction.totalAmount);
            }

            await this.sessionRepository.save(session);
        }

        transaction.status = TransactionStatus.REFUNDED;
        transaction.notes = reason ? `Refund: ${reason}` : 'Refunded';

        return this.transactionRepository.save(transaction);
    }

    // Void a transaction
    async voidTransaction(transactionId: number, reason?: string): Promise<PosTransaction> {
        const transaction = await this.transactionRepository.findOne({
            where: { id: transactionId },
            relations: ['session'],
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        if (transaction.status !== TransactionStatus.COMPLETED) {
            throw new BadRequestException('Can only void completed transactions');
        }

        // Restore stock
        for (const item of transaction.items) {
            const product = await this.productRepository.findOneBy({ id: item.productId });
            if (product) {
                product.stock += item.quantity;
                await this.productRepository.save(product);
            }
        }

        // Update session totals
        const session = transaction.session;
        if (session) {
            session.totalSales = Number(session.totalSales) - Number(transaction.totalAmount);
            session.transactionCount -= 1;
            
            if (transaction.paymentMethod === PaymentMethod.CASH) {
                session.totalCashSales = Number(session.totalCashSales) - Number(transaction.totalAmount);
            } else if (transaction.paymentMethod === PaymentMethod.CARD) {
                session.totalCardSales = Number(session.totalCardSales) - Number(transaction.totalAmount);
            }

            await this.sessionRepository.save(session);
        }

        transaction.status = TransactionStatus.VOIDED;
        transaction.notes = reason ? `Voided: ${reason}` : 'Voided';

        return this.transactionRepository.save(transaction);
    }

    // Get daily sales report
    async getDailySalesReport(storeId: number, date: string): Promise<any> {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const transactions = await this.transactionRepository
            .createQueryBuilder('transaction')
            .where('transaction.storeId = :storeId', { storeId })
            .andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
            .getMany();

        const totalSales = transactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);
        const totalCash = transactions
            .filter(t => t.paymentMethod === PaymentMethod.CASH)
            .reduce((sum, t) => sum + Number(t.totalAmount), 0);
        const totalCard = transactions
            .filter(t => t.paymentMethod === PaymentMethod.CARD)
            .reduce((sum, t) => sum + Number(t.totalAmount), 0);

        return {
            date,
            storeId,
            totalTransactions: transactions.length,
            totalSales,
            totalCashSales: totalCash,
            totalCardSales: totalCard,
            transactions,
        };
    }
}
