import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { Post } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { Body } from "@nestjs/common/decorators/http/route-params.decorator";
import { WhatsappService } from "./whatsapp.service";

@Controller('webhook')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post()
  async receive(@Body() body: any) {
    const message = body.message?.text;
    const from = body.message?.from;
    const response = await this.whatsappService.handleMessage(message, from);
    return { reply: response };
  }
}