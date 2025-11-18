import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(8, 8)
  @Matches(/^\d{8}$/, { message: '학번은 8자리 숫자여야 합니다.' })
  studentId: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;
}