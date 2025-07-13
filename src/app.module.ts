import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { UserRepository } from './user/user.repository';
import { UserService, SubscriptionService } from './user/user.service';
import { UserController, SubscriptionController } from './user/user.controller';
import { SubscriptionRepository } from './user/user.repository'; 
import { AuthService } from './auth/auth.service';
import { IdpAuthGuard } from './auth/idp.guard';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    HttpModule,
  ],
  controllers: [UserController, SubscriptionController],
  providers: [
    PrismaService,
    UserRepository,
    UserService,
    SubscriptionService,
    SubscriptionRepository,
    AuthService,
    IdpAuthGuard,
  ],
})
export class AppModule {}