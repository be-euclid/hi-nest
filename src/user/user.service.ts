import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async getUserStatistics(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 오늘의 예약 통계
    const todayReservations = await this.prisma.reservation.findMany({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
        status: 'ACTIVE',
      },
    });

    const todayHours = todayReservations.reduce((sum, r) => {
      const hours = (r.endTime.getTime() - r.startTime.getTime()) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    // 전체 예약 수
    const totalReservations = await this.prisma.reservation.count({
      where: {
        userId,
        status: 'ACTIVE',
      },
    });

    // 양도 통계 - 내가 양도한 건수
    const transfersGiven = await this.prisma.market.count({
      where: {
        originalUserId: userId,
      },
    });

    // 양도받은 건수 - 두 단계로 조회
    const myReservationsWithMarket = await this.prisma.reservation.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        market: true,
      },
    });

    // market이 있고, 원래 소유자가 나와 다른 경우
    const transfersReceived = myReservationsWithMarket.filter(
      r => r.market && !r.market.isAvailable && r.market.originalUserId !== userId
    ).length;

    return {
      todayHours,
      remainingHours: Math.max(0, 4 - todayHours),
      totalReservations,
      transfersGiven,
      transfersReceived,
    };
  }
}