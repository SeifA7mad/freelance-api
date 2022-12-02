import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport-strategy/jwt.strategy';
import { JwtRefreshTokenStrategy } from './passport-strategy/jwtRefreshToken.strategy';
import { GoogleStrategy } from './passport-strategy/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    GoogleStrategy,
  ],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXP_H,
      },
    }),
    PassportModule.register({ defaultStrategy: ['jwt', 'google'] }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
