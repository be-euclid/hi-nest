import { Controller, Get, Post, Body, UseGuards, Request, Query, Param, Delete } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('api')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('availability')
  async getAvailability(@Query('date') date: string) {
    return this.reservationService.checkAvailability(new Date(date));
  }

  @UseGuards(JwtAuthGuard)
  @Post('reservations')
  async createReservation(@Request() req, @Body() dto: CreateReservationDto) {
    return this.reservationService.createReservation(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mypage/reservations')
  async getMyReservations(@Request() req) {
    return this.reservationService.getUserReservations(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('reservations/:id')
  async cancelReservation(@Request() req, @Param('id') id: string) {
    return this.reservationService.cancelReservation(req.user.id, id);
  }
}