import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from 'src/module/auth/dto/user-jwt-payload.interface';

@Injectable()
export class UserExceptAdminAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user || user.userType === UserType.ADMIN) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
