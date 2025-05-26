import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { PricesModule } from '../prices/prices.module';
import { OrdersController } from '../orders/order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order]) , PricesModule],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
