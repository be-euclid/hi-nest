import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ReservationRepository } from './reservation.repository';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository],
  exports: [ReservationService, ReservationRepository], // Market 모듈에서 사용
})
export class ReservationModule {}