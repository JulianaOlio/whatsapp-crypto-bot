import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { BuyCryptoDto } from '../dto/buy-crypto.dto';
import { Order } from './order.entity';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    async findAll(): Promise<Order[]> {
        return this.ordersService.findAll();
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
        return this.ordersService.findById(id);
    }

    @Post()
    async create(@Body() orderDto: BuyCryptoDto): Promise<Order> {
        return this.ordersService.create(orderDto);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: Partial<BuyCryptoDto>,
    ): Promise<Order> {
        return this.ordersService.update(id, updateData);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        await this.ordersService.remove(id);
        return { message: `Order with id ${id} deleted successfully` };
    }

    @Post('whatsapp')
    async processWhatsappOrder(
        @Body('message') message: string,
        @Body('userId') userId: number,
    ): Promise<Order> {
        return this.ordersService.processWhatsappOrder(message, userId);
    }
}
