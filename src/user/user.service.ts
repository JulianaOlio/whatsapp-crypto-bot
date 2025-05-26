import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}

  private normalizePhone(phone: string): string {
      return phone.replace(/\D/g, '');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
      const whatsappNumber = this.normalizePhone(createUserDto.whatsappNumber);
      const newUser = this.userRepository.create({
        ...createUserDto,
        whatsappNumber,
      });
      return this.userRepository.save(newUser);
  }

  
  async registerWhatsappNumber(id: number, whatsappNumber: string, name: string,): Promise<User> {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`Usuário com id ${id} não encontrado`);
      }
      user.whatsappNumber = this.normalizePhone(whatsappNumber);
      user.name = name;
      return this.userRepository.save(user);
  }

  async findByWhatsappNumber(whatsappNumber: string): Promise<User | null> {
      const normalized = this.normalizePhone(whatsappNumber);
      return this.userRepository.findOne({ where: { whatsappNumber: normalized } });
  }
}

