import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';

@Module({
  imports: [HttpModule],
  providers: [PricesService],
  controllers: [PricesController],
  exports: [PricesService],
})
export class PricesModule {}