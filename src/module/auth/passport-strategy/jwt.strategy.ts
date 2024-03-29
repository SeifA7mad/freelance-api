import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserJwtPayload } from '../dto/user-jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: UserJwtPayload) {
    const { userId, username, email, userType } = payload;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        account: true,
        freelancer: true,
        client: true,
        admin: {
          include: {
            privileges: {
              select: {
                Privilege: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return { ...user, userType };
  }
}
