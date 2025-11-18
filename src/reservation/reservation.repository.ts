import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ReservationStatus } from '../types/enums';

@Injectable()
export class ReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRooms() {
    return this.prisma.room.findMany({
      orderBy: { floor: 'asc' },
    });
  }

  async getReservationsByDate(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.reservation.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: 'ACTIVE',
      },
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
    });
  }

  async getUserReservationHours(userId: string, date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const reservations = await this.prisma.reservation.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: 'ACTIVE',
      },
    });

    return reservations.reduce((total, r) => {
      const hours = (r.endTime.getTime() - r.startTime.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);
  }

  async checkTimeConflict(roomId: number, startTime: Date, endTime: Date) {
    const conflict = await this.prisma.reservation.findFirst({
      where: {
        roomId,
        status: 'ACTIVE',
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    return !!conflict;
  }

  async createReservation(data: any) {
    return this.prisma.reservation.create({
      data,
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
    });
  }

  async getUserReservations(userId: string) {
    return this.prisma.reservation.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        room: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: {
        room: true,
        user: true,
      },
    });
  }

  async updateStatus(id: string, status: ReservationStatus) {
    return this.prisma.reservation.update({
      where: { id },
      data: { status },
    });
  }

  async updateOwner(reservationId: string, newUserId: string) {
    return this.prisma.reservation.update({
      where: { id: reservationId },
      data: { 
        userId: newUserId,
        status: ReservationStatus.ACTIVE,
      },
    });
  }
}