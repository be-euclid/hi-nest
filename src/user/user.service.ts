import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { SubscriptionRepository } from './user.repository'; 

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpService,
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
        throw new UnauthorizedException('IDP 토큰이 유효하지 않습니다.');
      }
      throw new UnauthorizedException('IDP 인증에 실패했습니다.');
    }
  }
}

export class SubscriptionService {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  async subscribe(userId: string, categoryId: number) {
    const already = await this.subscriptionRepository.isSubscribed(userId, categoryId);
    if (already) {
      throw new ConflictException('이미 구독한 카테고리입니다.');
    }
    return this.subscriptionRepository.subscribeCategory(userId, categoryId);
  }

  async unsubscribe(userId: string, categoryId: number) {
    const existing = await this.subscriptionRepository.isSubscribed(userId, categoryId);
    if (!existing) {
      throw new NotFoundException('구독 정보가 존재하지 않습니다.');
    }
    return this.subscriptionRepository.unsubscribeCategory(userId, categoryId);
  }
}