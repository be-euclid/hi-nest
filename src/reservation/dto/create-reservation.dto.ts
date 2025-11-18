import { IsNotEmpty, IsString, IsNumber, IsDateString, IsISO8601 } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @IsNotEmpty()
  @IsDateString()
  date: string; // YYYY-MM-DD 형식

  @IsNotEmpty()
  @IsISO8601()
  startTime: string; // ISO 8601 형식 (예: 2024-01-01T09:00:00Z)

  @IsNotEmpty()
  @IsISO8601()
  endTime: string; // ISO 8601 형식
}