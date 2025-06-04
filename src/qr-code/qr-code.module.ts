import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';  

import { QrCodeService } from './qr-code.service';

@Module({
  imports: [HttpModule],   
  providers: [QrCodeService],
  exports: [QrCodeService],  
})
export class QrCodeModule {}
