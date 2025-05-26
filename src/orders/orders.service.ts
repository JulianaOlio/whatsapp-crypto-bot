import { Injectable, BadRequestException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './order.entity';
import { BuyCryptoDto } from '../dto/buy-crypto.dto';
import { OrderType, OrderSource, OrderStatus,} from './constants';
import { PricesService } from '../prices/prices.service'; // ajuste o caminho conforme necessário

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly pricesService: PricesService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async findById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async create(orderDto: BuyCryptoDto): Promise<Order> {
    const { type, asset, amount } = orderDto;

    if (!type || !asset || amount == null) {
      throw new BadRequestException(
        'Missing required fields: type, asset or amount',
      );
    }

    const price = await this.pricesService.getPrice(asset);
    if (price == null) {
      throw new BadRequestException(
        `Preço não encontrado para o ativo ${asset}`,
      );
    }

    const totalInBRL = price * amount;

    const newOrder = this.orderRepository.create({
      ...orderDto,
      priceAtExecution: price,
      totalInBRL,
    });

    return await this.orderRepository.save(newOrder);
  }

  async update(
    id: number,
    updateData: Partial<BuyCryptoDto>,
  ): Promise<Order> {
    await this.orderRepository.update(id, updateData);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
  }

  async processWhatsappOrder(
    message: string,
    userId: number,
  ): Promise<Order> {
    const regex = /comprar\s+(\d*\.?\d+)\s*([A-Za-z0-9]+)/i;
    const match = message.match(regex);
    if (!match) {
      throw new BadRequestException(
        'Formato inválido. Exemplo esperado: "comprar 0.5 BTC"',
      );
    }

    const amount = parseFloat(match[1]);
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Quantidade inválida.');
    }

    const asset = match[2].toUpperCase();

    const orderDto: BuyCryptoDto = {
      userId,
      type: OrderType.BUY,
      asset,
      amount,
      source: OrderSource.WHATSAPP,
      status: OrderStatus.PENDING,
    };

    return this.create(orderDto); // já buscará preço e calculará total
  }
}

