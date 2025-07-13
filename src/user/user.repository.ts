import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySub(sub: string) {
    return this.prisma.user.findUnique({
      where: { sub },
    });
  }

  async createIdpUser(data: { sub: string; name: string; email: string }) {
    return this.prisma.user.create({
      data: {
        sub: data.sub,
        name: data.name,
        email: data.email,
      },
    });
  }
}

export class SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async subscribeCategory(userId: string, categoryId: number) {
    return this.prisma.userCategorySubscription.create({
      data: {
        userId,
        categoryId,
      },
    });
  }

  async unsubscribeCategory(userId: string, categoryId: number) {
    return this.prisma.userCategorySubscription.delete({
      where: {
        userId_categoryId: { userId, categoryId },
      },
    });
  }

  async isSubscribed(userId: string, categoryId: number) {
    return this.prisma.userCategorySubscription.findUnique({
      where: {
        userId_categoryId: { userId, categoryId },
      },
    });
  }
}