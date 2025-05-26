import { Controller, Post, Put, Get, Param, Body, ParseIntPipe, NotFoundException, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from './user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() dto: CreateUserDto): Promise<User> {
        return this.userService.create(dto);
    }

    @Put(':id/register-whatsapp')
    async registerWhatsapp(
        @Param('id', ParseIntPipe) id: number,
        @Body('whatsappNumber') whatsappNumber: string,
        @Body('name') name: string,
        ): Promise<User> {
        return this.userService.registerWhatsappNumber(id, whatsappNumber, name);
    }

    @Get('whatsapp/:number')
    async findByWhatsapp(
            @Param('number') number: string,
            ): Promise<User> {
            const user = await this.userService.findByWhatsappNumber(number);
            if (!user) {
            throw new NotFoundException(`Usuário com WhatsApp ${number} não encontrado`);
            }
            return user;
    }
}
  