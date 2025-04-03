import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
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

  // 회원 가입 
  async register(dto: RegisterUserDto) {
    const existingUser = await this.userRepository.findUserByUsername(dto.username);
    if (existingUser) {
      throw new ConflictException('이미 존재하는 사용자입니다.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10); 

    // 사용자 생성
    const user = await this.userRepository.createUser(dto.username, hashedPassword);

    return { id: user.id, username: user.username };
  }

  // 로그인
  async login(dto: LoginUserDto) {
    const user = await this.userRepository.findUserByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('유효하지 않은 사용자입니다.');
    }

    // 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    // JWT 생성
    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    return { accessToken: token };
  }

  async verifyAccessToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }  
}
