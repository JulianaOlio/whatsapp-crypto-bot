import { Controller, Post, Body } from "@nestjs/common";
import { QrCodeService } from "./qr-code.service";

@Controller("qr-code")
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Post("generate")
  async generate(@Body("value") value: number) {
    return this.qrCodeService.generateQrCode(value);
  }
}
