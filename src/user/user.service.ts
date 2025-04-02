import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterUserDto } from './dto/user-register.dto';
import { LoginUserDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    return this.userRepository.createUser(dto);
  }

  async login(dto: LoginUserDto) {
    const user = await this.userRepository.findUserByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');
    }

    const payload = { userId: user.id, username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async verifyAccessToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
