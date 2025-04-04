import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateOrCreateOAuthUser(profile: any) {
    const { provider, id, displayName, emails } = profile;

    const email = emails[0].value;

    let user = await this.prisma.user.findUnique({
      where: { username: email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          username: email,
          displayName: displayName,
          oauthProvider: provider,
          password: null,
        },
      });
    }

    return user;
  }

  async generateJwt(user: any): Promise<string> {
    const payload = {
      sub: user.id,
      username: user.username,
    };
    return this.jwtService.sign(payload);
  }
}
