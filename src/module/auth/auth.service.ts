import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { compare, hash } from 'bcryptjs';
import { UserJwtPayload, UserType } from './dto/user-jwt-payload.interface';
import { Account, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(authCredentialsDto: AuthCredentialsDto) {
    const userAccount = await this.prisma.account.findUnique({
      where: {
        email: authCredentialsDto.email,
      },
      include: {
        user: {
          include: {
            admin: true,
            client: true,
            freelancer: true,
          },
        },
      },
    });

    if (
      !userAccount ||
      !(await compare(authCredentialsDto.password, userAccount.password))
    ) {
      throw new UnauthorizedException('Incorrect login credentials!');
    }

    const payload: UserJwtPayload = {
      userId: userAccount.user.id,
      email: userAccount.email,
      username: userAccount.userName,
      userType: await this.getUserType(userAccount.user.id, userAccount.user),
    };

    const { accessToken, refreshToken } = await this.getTokens(payload);

    const updatedUser = await this.updateRefreshToken(
      payload.userId,
      refreshToken,
    );

    return {
      accessToken,
      refreshToken,
      user: updatedUser,
    };
  }

  async logout(userId: string) {
    return this.prisma.user.update({
      data: {
        account: {
          update: {
            refreshToken: null,
          },
        },
      },
      where: {
        id: userId,
      },
      include: {
        account: true,
      },
    });
  }

  async getProfile(userId: string) {
    const includesFreelancer = {
      include: {
        freelancerSkills: {
          include: {
            skill: true,
          },
        },
      },
    };
    const includesAdmin = {
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
    };

    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        creditCards: true,
        freelancer: includesFreelancer,
        client: true,
        admin: includesAdmin,
      },
    });
  }

  private async getUserType(userId: string, userData: any = null) {
    if (!userData) {
      userData = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          freelancer: true,
          client: true,
          admin: true,
        },
      });
    }

    let userType: UserType = UserType.ADMIN;

    if (userData.freelancer) {
      userType = UserType.FREELANCER;
    } else if (userData.client) {
      userType = UserType.CLIENT;
    }

    return userType;
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken, 12);
    return this.prisma.user.update({
      data: {
        account: {
          update: {
            refreshToken: hashedRefreshToken,
          },
        },
      },
      where: {
        id: userId,
      },
      include: {
        account: true,
      },
    });
  }

  private async getTokens(payload: UserJwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXP_H,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_EXP_REFRESH,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(user: User & { account: Account }, refreshToken: string) {
    const refreshTokenMatches = await compare(
      refreshToken,
      user.account.refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const payload: UserJwtPayload = {
      userId: user.id,
      email: user.account.email,
      username: user.account.userName,
      userType: await this.getUserType(user.id),
    };

    const { accessToken, refreshToken: newRefreshToken } = await this.getTokens(
      payload,
    );

    const updatedUser = await this.updateRefreshToken(user.id, newRefreshToken);
    return {
      accessToken,
      refreshToken,
      user: updatedUser,
    };
  }

  async getUserPayload(jwtToken: string) {
    try {
      const userPayload = await this.jwtService.verifyAsync(jwtToken);
      return userPayload;
    } catch (err) {
      return null;
    }
  }
}
