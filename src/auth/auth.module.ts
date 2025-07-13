import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { IdpAuthGuard } from './idp.guard';
import { UserRepository } from '../user/user.repository';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [HttpModule],
  providers: [AuthService, IdpAuthGuard, UserRepository, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
