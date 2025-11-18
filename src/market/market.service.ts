import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { MarketRepository } from './market.repository';
import { ReservationRepository } from '../reservation/reservation.repository';
import { ReservationStatus } from '../types/enums';

@Injectable()
export class MarketService {
  private readonly MAX_HOURS_PER_DAY = 4;

  constructor(
    private readonly marketRepository: MarketRepository,
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async getAvailableTransfers() {
    return this.marketRepository.getAvailableTransfers();
  }

  async registerTransfer(userId: string, reservationId: string, price?: number, description?: string) {
    const reservation = await this.reservationRepository.findById(reservationId);
    
    if (!reservation) {
      throw new BadRequestException('예약을 찾을 수 없습니다.');
    }
    
    if (reservation.userId !== userId) {
      throw new ForbiddenException('본인의 예약만 양도할 수 있습니다.');
    }
    
    // status 비교 시 문자열로
    if (reservation.status !== ReservationStatus.ACTIVE) {
      throw new BadRequestException('활성 예약만 양도할 수 있습니다.');
    }

    // 현재 시간이 예약 시작 시간을 지났는지 확인
    const now = new Date();
    if (now >= reservation.startTime) {
      throw new BadRequestException('이미 시작된 예약은 양도할 수 없습니다.');
    }

    // 양도 등록
    const market = await this.marketRepository.createTransfer({
      reservationId,
      originalUserId: userId,
      price: price || 0,
      description,
    });

    // 예약 상태를 TRANSFERRED로 변경
    await this.reservationRepository.updateStatus(
      reservationId, 
      ReservationStatus.TRANSFERRED
    );

    return market;
  }

  async claimTransfer(userId: string, transferId: string) {
    const market = await this.marketRepository.findById(transferId);
    
    if (!market) {
      throw new BadRequestException('양도 항목을 찾을 수 없습니다.');
    }
    
    if (!market.isAvailable) {
      throw new BadRequestException('이미 양도가 완료된 항목입니다.');
    }
    
    if (market.originalUserId === userId) {
      throw new ForbiddenException('본인이 등록한 양도는 받을 수 없습니다.');
    }

    const reservation = await this.reservationRepository.findById(market.reservationId);
    
    // ✅ null 체크 추가
    if (!reservation) {
      throw new BadRequestException('양도 대상 예약을 찾을 수 없습니다.');
    }
    
    // 현재 시간이 예약 시작 시간을 지났는지 확인
    const now = new Date();
    if (now >= reservation.startTime) {
      throw new BadRequestException('이미 시작된 예약은 양도받을 수 없습니다.');
    }

    // 4시간 제한 검증
    const reservationHours = (reservation.endTime.getTime() - reservation.startTime.getTime()) / (1000 * 60 * 60);
    const existingHours = await this.reservationRepository.getUserReservationHours(
      userId,
      reservation.date
    );
    
    if (existingHours + reservationHours > this.MAX_HOURS_PER_DAY) {
      throw new ForbiddenException(
        `일일 예약 제한(${this.MAX_HOURS_PER_DAY}시간)을 초과합니다. ` +
        `현재 예약: ${existingHours}시간, 양도받을 예약: ${reservationHours}시간`
      );
    }

    // 양도 처리
    await this.marketRepository.completeTransfer(transferId, userId);
    
    // 예약 소유권 변경
    await this.reservationRepository.updateOwner(market.reservationId, userId);
    
    return {
      success: true,
      message: '양도가 완료되었습니다.',
      reservation,
    };
  }

  async cancelTransfer(userId: string, transferId: string) {
    const market = await this.marketRepository.findById(transferId);
    
    if (!market) {
      throw new BadRequestException('양도 항목을 찾을 수 없습니다.');
    }
    
    if (market.originalUserId !== userId) {
      throw new ForbiddenException('본인이 등록한 양도만 취소할 수 있습니다.');
    }
    
    if (!market.isAvailable) {
      throw new BadRequestException('이미 양도가 완료된 항목입니다.');
    }

    // 양도 취소
    await this.marketRepository.delete(transferId);
    
    // 예약 상태를 다시 ACTIVE로 변경
    await this.reservationRepository.updateStatus(
      market.reservationId, 
      ReservationStatus.ACTIVE
    );
    
    return {
      success: true,
      message: '양도가 취소되었습니다.',
    };
  }
}