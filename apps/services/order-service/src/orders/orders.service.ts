import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

import { OrderIntegrationsService } from '../integrations/order-integrations.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly integrationsService: OrderIntegrationsService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, shippingAddress, notes } = createOrderDto;

    // Calculate totals and validate products
    let subtotal = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of items) {
      const product = await this.integrationsService.validateProduct(item.productId);
      if (!product || !product.success) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      if (product.data.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.data.name}`);
      }

      const totalPrice = product.data.price * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        productId: item.productId,
        productName: product.data.name,
        productImage: product.data.image,
        quantity: item.quantity,
        unit: product.data.unit || 'kg',
        unitPrice: product.data.price,
        totalPrice,
      });

      // Reserve stock
      await this.integrationsService.updateProductStock(item.productId, item.quantity, 'subtract');
    }

    // Calculate shipping
    const freeShippingThreshold = parseInt(process.env.FREE_SHIPPING_THRESHOLD || '1000', 10);
    const defaultShippingCost = parseInt(process.env.DEFAULT_SHIPPING_COST || '50', 10);
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : defaultShippingCost;
    const totalAmount = subtotal + shippingCost;

    // Create order
    const order = this.orderRepository.create({
      userId,
      shippingAddress,
      notes,
      subtotal,
      shippingCost,
      totalAmount,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    for (const item of orderItems) {
      const orderItem = this.orderItemRepository.create({
        ...item,
        orderId: savedOrder.id,
      });
      await this.orderItemRepository.save(orderItem);
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(page = 1, limit = 10, status?: OrderStatus): Promise<PaginatedResult<Order>> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .orderBy('order.createdAt', 'DESC');

    if (status) {
      queryBuilder.where('order.status = :status', { status });
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByUser(userId: string, page = 1, limit = 10): Promise<PaginatedResult<Order>> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.orderRepository.findAndCount({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderNumber },
      relations: ['items'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    const { status, cancelledReason } = updateStatusDto;

    // Validate status transitions
    this.validateStatusTransition(order.status, status);

    order.status = status;

    // Update timestamps based on status
    const now = new Date();
    switch (status) {
      case OrderStatus.CONFIRMED:
        order.confirmedAt = now;
        break;
      case OrderStatus.SHIPPED:
        order.shippedAt = now;
        break;
      case OrderStatus.DELIVERED:
        order.deliveredAt = now;
        break;
      case OrderStatus.CANCELLED:
        order.cancelledAt = now;
        order.cancelledReason = cancelledReason || 'No reason provided';

        // Reverse stock
        for (const item of order.items) {
          await this.integrationsService.updateProductStock(item.productId, item.quantity, 'add');
        }
        break;
    }

    // Log status history
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    order.statusHistory.push({
      status,
      timestamp: now,
      reason: status === OrderStatus.CANCELLED ? cancelledReason : undefined,
    });

    return this.orderRepository.save(order);
  }

  async cancel(id: string, reason: string): Promise<Order> {
    return this.updateStatus(id, { status: OrderStatus.CANCELLED, cancelledReason: reason });
  }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(`Cannot transition from ${currentStatus} to ${newStatus}`);
    }
  }

  async countByStatus(): Promise<Record<OrderStatus, number>> {
    const counts = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    const result: Record<string, number> = {};
    for (const status of Object.values(OrderStatus)) {
      result[status] = 0;
    }
    for (const row of counts) {
      result[row.status] = parseInt(row.count, 10);
    }

    return result as Record<OrderStatus, number>;
  }
}
