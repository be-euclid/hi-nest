import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserRepository } from './user/user.repository';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    PrismaModule, 
    PassportModule,
    JwtModule.register({
      secret: '1234567890',
      signOptions: { algorithm: 'HS256', expiresIn: '7d' },
    }),
  ],
  providers: [PrismaService, UserRepository, UserService, JwtStrategy],
  controllers: [UserController],
})
export class AppModule {}
