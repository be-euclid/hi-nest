import { Controller, Get, UseGuards, Request, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return {
      id: req.user.id,
      studentId: req.user.studentId,
      name: req.user.name,
      createdAt: req.user.createdAt,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getUserStats(@Request() req) {
    return this.userService.getUserStatistics(req.user.id);
  }
}