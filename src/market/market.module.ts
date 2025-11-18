import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { MarketRepository } from './market.repository';
import { ReservationModule } from '../reservation/reservation.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ReservationModule, // ReservationRepository를 사용하기 위해 import
  ],
  controllers: [MarketController],
  providers: [MarketService, MarketRepository],
  exports: [MarketService],
})
export class MarketModule {}