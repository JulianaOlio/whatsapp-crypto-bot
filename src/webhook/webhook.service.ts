import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ASAAS_API_URL, API_KEY } from "../constants";

@Injectable()
export class WebhookService {
  constructor(private readonly httpService: HttpService) {}

  async handlePaymentEvent(event: string, payment: any) {
    const headers = { access_token: API_KEY };

    const response$ = this.httpService.get(
      `${ASAAS_API_URL}/payments/${payment.id}`,
      { headers }
    );

    const { data: paymentData } = await firstValueFrom(response$);

    if (!paymentData || paymentData.status !== payment.status) {
      throw new Error("Pagamento não encontrado ou status divergente.");
    }

    const messageMap = {
      PAYMENT_RECEIVED: `Pagamento recebido com sucesso: ${payment.id}, valor: ${payment.value}`,
      PAYMENT_CONFIRMED: `Pagamento confirmado: ${payment.id}, valor: ${payment.value}`,
    };

    const message = messageMap[event] || `Evento desconhecido: ${event}`;

    return {
      id: payment.id,
      value: payment.value,
      status: payment.status,
      event,
      message,
      asaasPaymentData: paymentData,
    };
  }
}

