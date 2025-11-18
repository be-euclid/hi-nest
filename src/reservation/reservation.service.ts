import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationStatus } from '../types/enums'; // Prisma enum 대신 import

@Injectable()
export class ReservationService {
  private readonly MAX_HOURS_PER_DAY = 4;

  constructor(private readonly reservationRepository: ReservationRepository) {}

  async checkAvailability(date: Date) {
    const rooms = await this.reservationRepository.getAllRooms();
    const reservations = await this.reservationRepository.getReservationsByDate(date);
    
    return rooms.map(room => {
      const roomReservations = reservations.filter(r => r.roomId === room.id);
      const totalReservedHours = roomReservations.reduce((sum, r) => {
        const hours = (r.endTime.getTime() - r.startTime.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);
      
      let status = 'available';
      if (totalReservedHours >= room.capacity * 8) { // 8시간 운영 기준
        status = 'full';
      } else if (totalReservedHours > 0) {
        status = 'partial';
      }
      
      return {
        roomId: room.id,
        roomName: room.name,
        type: room.type,
        capacity: room.capacity,
        status,
        availableHours: Math.max(0, room.capacity * 8 - totalReservedHours),
      };
    });
  }

  async createReservation(userId: string, dto: CreateReservationDto) {
    // 1. 요청된 시간 계산
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);
    const requestedHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    
    if (requestedHours <= 0) {
      throw new BadRequestException('종료 시간은 시작 시간 이후여야 합니다.');
    }

    // 2. 해당 날짜의 기존 예약 시간 확인
    const date = new Date(dto.date);
    const existingHours = await this.reservationRepository.getUserReservationHours(
      userId,
      date
    );
    
    // 3. 4시간 제한 검증
    if (existingHours + requestedHours > this.MAX_HOURS_PER_DAY) {
      throw new ForbiddenException(
        `일일 예약 제한(${this.MAX_HOURS_PER_DAY}시간)을 초과합니다. ` +
        `현재 예약: ${existingHours}시간, 요청: ${requestedHours}시간`
      );
    }

    // 4. 시간대 중복 검사
    const isConflict = await this.reservationRepository.checkTimeConflict(
      dto.roomId,
      startTime,
      endTime
    );
    
    if (isConflict) {
      throw new BadRequestException('해당 시간대에 이미 예약이 있습니다.');
    }

    // 5. 예약 생성
    return this.reservationRepository.createReservation({
      userId,
      roomId: dto.roomId,
      date,
      startTime,
      endTime,
    });
  }

  async getUserReservations(userId: string) {
    return this.reservationRepository.getUserReservations(userId);
  }

  async cancelReservation(userId: string, reservationId: string) {
    const reservation = await this.reservationRepository.findById(reservationId);
    
    if (!reservation) {
      throw new BadRequestException('예약을 찾을 수 없습니다.');
    }
    
    if (reservation.userId !== userId) {
      throw new ForbiddenException('본인의 예약만 취소할 수 있습니다.');
    }
    
    return this.reservationRepository.updateStatus(
      reservationId, 
      ReservationStatus.CANCELLED
    );
  }
}