import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MarketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailableTransfers() {
    return this.prisma.market.findMany({
      where: {
        isAvailable: true,
        reservation: {
          startTime: {
            gt: new Date(), // 아직 시작하지 않은 예약만
          },
        },
      },
      include: {
        reservation: {
          include: {
            room: true,
            user: {
              select: {
                id: true,
                studentId: true,
                name: true,
              },
            },
          },
        },
        originalUser: {
          select: {
            id: true,
            studentId: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.market.findUnique({
      where: { id },
      include: {
        reservation: {
          include: {
            room: true,
          },
        },
      },
    });
  }

  async createTransfer(data: any) {
    return this.prisma.market.create({
      data,
      include: {
        reservation: {
          include: {
            room: true,
          },
        },
      },
    });
  }

  async completeTransfer(transferId: string, newUserId: string) {
    return this.prisma.$transaction([
      // 마켓 항목 비활성화
      this.prisma.market.update({
        where: { id: transferId },
        data: { isAvailable: false },
      }),
      // 예약 소유자 변경 및 상태 업데이트는 별도로 처리
    ]);
  }

  async delete(id: string) {
    return this.prisma.market.delete({
      where: { id },
    });
  }
}