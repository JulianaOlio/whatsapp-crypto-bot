import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PricesService } from './prices.service';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get(':asset')
  async getPrice(@Param('asset') asset: string): Promise<{ asset: string; price: number }> {
    const price = await this.pricesService.getPrice(asset);

    if (price === null) {
      throw new NotFoundException(`Preço não encontrado para o ativo ${asset}`);
    }

    return { asset: asset.toUpperCase(), price };
  }
}
