  import { Injectable } from '@nestjs/common';
  import { HttpService } from '@nestjs/axios';
  import { firstValueFrom } from 'rxjs';

  @Injectable()
  export class PricesService {
    constructor(private readonly httpService: HttpService) {}

    async getPrice(asset: string): Promise<number | null> {
      try {
          const assetMap = {
          BTC: 'bitcoin',
          ETH: 'ethereum',
          USDT: 'tether',
        };

        const coinId = assetMap[asset.toUpperCase()];
        if (!coinId) {
          return null;
        }

        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=brl`;

        const response = await firstValueFrom(this.httpService.get(url));

        const price = response.data[coinId]?.brl;

        if (!price) {
          return null;
        }

        return price;
      } catch (error) {
        console.error('Erro ao buscar preço:', error);
        return null;
      }
    }
  }
