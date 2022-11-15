import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { compare } from 'bcryptjs';
import { UserJwtPayload } from './dto/user-jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(authCredentialsDto: AuthCredentialsDto) {
    const userAccount = await this.prisma.account.findUnique({
      where: {
        email: authCredentialsDto.email,
      },
      include: {
        user: true,
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
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        ...userAccount.user,
        account: {
          id: userAccount.id,
          username: userAccount.userName,
          email: userAccount.email,
        },
      },
    };
  }
}
