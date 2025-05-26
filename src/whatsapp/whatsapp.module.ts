import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { OrdersModule } from '../orders/orders.module';
import { PricesModule } from '../prices/prices.module';
import { UserModule } from '../user/user.module';
import { WhatsappController } from './whatsapp.controller';

@Module({
  imports: [
    OrdersModule,
    PricesModule,
    UserModule,      
  ],
  providers: [WhatsappService],
  controllers: [WhatsappController],
  exports: [WhatsappService],
})
export class WhatsappModule {}