import { Controller, Post, Body, Delete, Request, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { IdpAuthGuard } from '../auth/idp.guard';
import { SubscriptionService } from './user.service';
import { CategorySubscribeDto } from './dto/category.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@Req() req: any) {
    return req.user;
  }
}

@Controller('categories')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(IdpAuthGuard)
  @Post('subscribe')
  async subscribe(@Request() req, @Body() dto: CategorySubscribeDto) {
    return this.subscriptionService.subscribe(req.user.id, dto.categoryId);
  }

  @UseGuards(IdpAuthGuard)
  @Delete('unsubscribe')
  async unsubscribe(@Request() req, @Body() dto: CategorySubscribeDto) {
    return this.subscriptionService.unsubscribe(req.user.id, dto.categoryId);
  }
}