import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 사용자 생성 
  async createUser(dto: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10); // 비밀번호 암호화

    return this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword, 
      },
    });
  }

  // 사용자 조회 (username)
  
  async findUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, password: true },
    });
  }


  // 사용자 조회 (ID)
  async findUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true }, 
    });
  }
}
