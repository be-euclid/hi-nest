import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByStudentId(studentId: string) {
    return this.prisma.user.findUnique({
      where: { studentId },
    });
  }

  async create(data: { studentId: string; passwordHash: string; name: string }) {
    return this.prisma.user.create({
      data,
    });
  }
}