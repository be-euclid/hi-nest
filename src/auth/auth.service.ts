import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UserRepository } from '../user/user.repository';
import { AxiosError } from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userRepository: UserRepository,
  ) {}

  async validateIdpToken(accessToken: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://api.idp.gistory.me/oauth/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );

      const { sub, name, email } = response.data;

      let user = await this.userRepository.findBySub(sub);
      if (!user) {
        user = await this.userRepository.createIdpUser({
          sub,
          name,
          email,
        });
      }

      return user;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        throw new UnauthorizedException('Invalid access token');
      }
      throw new UnauthorizedException('Failed to verify IDP token');
    }
  }
}