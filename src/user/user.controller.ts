import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/user-register.dto';
import { LoginUserDto } from './dto/user-login.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원 가입
  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.userService.register(dto);
  }

  // 로그인
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.userService.login(dto);
  }

  // JWT 검증
  @Post('verify')
  async verify(@Body('token') token: string) {
    return this.userService.verifyAccessToken(token);
  }
}
