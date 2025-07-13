import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('accessToken') accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException('Access token is required');
    }

    const user = await this.authService.validateIdpToken(accessToken);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  @Post('logout')
  async logout() {
    return { message: 'Logged out (client should delete token)' };
  }
}