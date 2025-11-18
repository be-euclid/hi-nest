import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReservationModule } from './reservation/reservation.module';
import { MarketModule } from './market/market.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    PassportModule,
    PrismaModule,
    UserModule,
    AuthModule,
    ReservationModule,
    MarketModule,
  ],
})
export class AppModule {}