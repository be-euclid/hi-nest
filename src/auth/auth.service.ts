import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(studentId: string, password: string) {
    const user = await this.userRepository.findByStudentId(studentId);
    
    if (!user) {
      throw new UnauthorizedException('학번 또는 비밀번호가 올바르지 않습니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('학번 또는 비밀번호가 올바르지 않습니다.');
    }

    const payload = { 
      sub: user.id, 
      studentId: user.studentId,
      name: user.name 
    };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        studentId: user.studentId,
        name: user.name,
      },
    };
  }

  async register(studentId: string, password: string, name: string) {
    const existingUser = await this.userRepository.findByStudentId(studentId);
    
    if (existingUser) {
      throw new UnauthorizedException('이미 등록된 학번입니다.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await this.userRepository.create({
      studentId,
      passwordHash,
      name,
    });

    return {
      id: user.id,
      studentId: user.studentId,
      name: user.name,
    };
  }

  async validateUser(userId: string) {
    return this.userRepository.findById(userId);
  }
}