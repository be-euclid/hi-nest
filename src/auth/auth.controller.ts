import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.studentId, loginDto.password);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.studentId,
      registerDto.password,
      registerDto.name
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // 클라이언트에서 토큰 삭제하도록 안내
    return { message: '로그아웃 되었습니다. (클라이언트에서 토큰을 삭제해주세요)' };
  }
}