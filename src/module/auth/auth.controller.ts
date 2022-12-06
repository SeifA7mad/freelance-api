import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthCredentialsSchema } from './validation/auth-credentials.validation';
import { UserAuthGuard } from 'src/guard/user-auth.guard';
import {
  JwtUserRequest,
  JwtRefreshTokenUserRequest,
} from 'src/util/global-types';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { RefreshTokenGuard } from 'src/guard/refresh-token.guard';
import { GoogleOauthGuard } from 'src/guard/google-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(AuthCredentialsSchema))
  login(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.login(authCredentialsDto);
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(UserAuthGuard)
  logout(@Req() req: JwtUserRequest) {
    return this.authService.logout(req.user.id);
  }

  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(UserAuthGuard)
  getProfile(@Req() req: JwtUserRequest) {
    return this.authService.getProfile(req.user.id);
  }

  @ApiBearerAuth()
  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Req() req: JwtRefreshTokenUserRequest) {
    return this.authService.refreshTokens(req.user, req.user.refreshToken);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  auth() {}

  @ApiExcludeEndpoint()
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  googleAuthCallback(@Req() req) {
    return req.user;
  }
}
