import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { UserService } from '../user/user.service';
import { PricesService } from '../prices/prices.service';
import { BuyCryptoDto } from '../dto/buy-crypto.dto';
import { OrderType, OrderSource, OrderStatus } from '../orders/constants';

const REGEX_COMPRAR = /comprar\s+(\d*\.?\d+)\s*(\w+)/i;

const MESSAGES = {
  INVALID_FORMAT: 'Formato inválido. Use: "comprar <quantidade> <ativo>", por exemplo: comprar 0.01 BTC',
  INVALID_QUANTITY: 'Quantidade inválida. Use um número maior que zero.',
  USER_NOT_FOUND: 'Número não cadastrado. Por favor, registre seu número antes de comprar.',
  PRICE_NOT_FOUND: (asset: string) => `Não foi possível encontrar o preço atual do ativo ${asset}.`,
  ORDER_CREATED: (amount: number, asset: string, total: number, id: number) =>
    `Ordem de compra criada!\n\nQuantidade: ${amount} ${asset}\nTotal: R$ ${total.toFixed(2)}\nID da ordem: ${id}`,
  HELP: 'Envie "comprar <quantidade> <ativo>" para iniciar uma compra de criptomoeda. Ex: comprar 0.01 BTC',
};

@Injectable()
export class WhatsappService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UserService,
    private readonly pricesService: PricesService,
  ) {}

  /** Remove tudo que não for dígito para normalizar o número */
  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  async handleMessage(message: string, from: string): Promise<string> {
    if (!message) {
      throw new BadRequestException(MESSAGES.HELP);
    }

    const trimmed = message.trim().toLowerCase();
    if (!trimmed.startsWith('comprar')) {
      return MESSAGES.HELP;
    }

    const match = trimmed.match(REGEX_COMPRAR);
    if (!match) {
      return MESSAGES.INVALID_FORMAT;
    }

    const amount = parseFloat(match[1]);
    const asset = match[2].toUpperCase();
    if (isNaN(amount) || amount <= 0) {
      return MESSAGES.INVALID_QUANTITY;
    }

    const normalizedFrom = this.normalizePhone(from);
    const user = await this.usersService.findByWhatsappNumber(normalizedFrom);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    const price = await this.pricesService.getPrice(asset);
    if (price == null || isNaN(price)) {
      return MESSAGES.PRICE_NOT_FOUND(asset);
    }

    const totalAmount = amount * price;
    const orderDto: BuyCryptoDto = {
      userId: user.id,
      type: OrderType.BUY,
      asset,
      amount,
      source: OrderSource.WHATSAPP,
      status: OrderStatus.PENDING,
    };

    const order = await this.ordersService.create(orderDto);
    return MESSAGES.ORDER_CREATED(amount, asset, totalAmount, order.id);
  }
}
