import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { BASE_URL, API_KEY, CHAVE_PIX } from "../constants";

@Injectable()
export class QrCodeService {
  constructor(private readonly httpService: HttpService) {}

  async generateQrCode(value: number) {
    const payload = {
      addressKey: CHAVE_PIX,
      value,
      expirationSeconds: 180,
      allowsMultiplePayments: false,
      format: "ALL",
    };

    const headers = {
      'Content-Type': 'application/json',
      access_token: API_KEY,
    };

    const response$ = this.httpService.post(BASE_URL, payload, { headers });
    const response = await firstValueFrom(response$);

    return response.data;
  }
}

