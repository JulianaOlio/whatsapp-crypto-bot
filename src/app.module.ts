import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { PricesModule } from './prices/prices.module';
import { OrdersModule } from './orders/orders.module';
import { QrCodeController } from "./qr-code/qr-code.controller";
import { WebhookController } from "./webhook/webhook.controller";
import { HttpModule } from '@nestjs/axios';
import { QrCodeModule } from './qr-code/qr-code.module';
import { WebhookModule } from './webhook/webhook.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule , HttpModule, QrCodeModule] ,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
      }),
    }),
    WhatsappModule,
    UserModule,
    PricesModule,
    OrdersModule,
    QrCodeModule,
    WebhookModule
  ],
  controllers: [AppController, QrCodeController, WebhookController],
  providers: [AppService],
})
export class AppModule {}
