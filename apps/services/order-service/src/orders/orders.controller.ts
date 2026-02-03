import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseUUIDPipe,
  Headers,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Headers('x-user-id') userId?: string) {
    // In production, userId should come from JWT token via gateway
    const finalUserId = userId || createOrderDto.userId || 'anonymous';
    const order = await this.ordersService.create(finalUserId, createOrderDto);
    return {
      success: true,
      data: order,
      message: 'Order placed successfully',
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: OrderStatus,
  ) {
    const result = await this.ordersService.findAll(page, limit, status);
    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.ordersService.findByUser(userId, page, limit);
    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('stats')
  async getStats() {
    const counts = await this.ordersService.countByStatus();
    return {
      success: true,
      data: counts,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.ordersService.findOne(id);
    return {
      success: true,
      data: order,
    };
  }

  @Get('number/:orderNumber')
  async findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    const order = await this.ordersService.findByOrderNumber(orderNumber);
    return {
      success: true,
      data: order,
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.ordersService.updateStatus(id, updateStatusDto);
    return {
      success: true,
      data: order,
      message: `Order status updated to ${order.status}`,
    };
  }

  @Get('health')
  healthCheck() {
    return {
      success: true,
      message: 'Order Service is running',
      timestamp: new Date().toISOString(),
    };
  }
}
