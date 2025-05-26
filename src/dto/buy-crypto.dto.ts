import { OrderType, OrderSource, OrderStatus } from '../orders/constants';

export class BuyCryptoDto {
  userId: number;
  type: OrderType;
  asset: string;
  amount: number;
  source: OrderSource;
  status: OrderStatus;
}