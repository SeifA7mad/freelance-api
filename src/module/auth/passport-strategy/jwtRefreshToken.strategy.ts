import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserJwtPayload } from '../dto/user-jwt-payload.interface';
import { Request } from 'express';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private prisma: PrismaService) {
    super({
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: UserJwtPayload) {
    const { userId, username, email } = payload;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        account: true,
        freelancer: true,
        client: true,
        admin: true,
      },
    });

    if (!user || !user.account.refreshToken) {
      throw new UnauthorizedException();
    }

    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

    return { ...user, refreshToken };
  }
}
