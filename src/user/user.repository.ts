import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterUserDto } from './dto/user-register.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 사용자 생성
  async createUser(dto: RegisterUserDto) {
    return this.prisma.user.create({
      data: {
        username: dto.username,
        password: dto.password, 
      },
    });
  }

  // 사용자 조회 (username)
  async findUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  // 사용자 조회 (ID)
  async findUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
