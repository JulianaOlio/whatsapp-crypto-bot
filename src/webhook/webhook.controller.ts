import { Controller, Post, Body, Headers, Res, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { WebhookService } from "./webhook.service";
import { WEBHOOK_AUTH_TOKEN } from "../constants";

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("payment")
  async handleWebhook(
    @Body() body: any,
    @Headers("asaas-access-token") accessToken: string,
    @Res() res: Response
  ) {
    if (accessToken !== WEBHOOK_AUTH_TOKEN) {
      return res.status(HttpStatus.FORBIDDEN).json({ error: "Token inválido" });
    }

    const { event, payment } = body;

    if (!event || !payment) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: "Payload inválido" });
    }

    try {
      const result = await this.webhookService.handlePaymentEvent(event, payment);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message || "Erro ao processar webhook",
      });
    }
  }
}
