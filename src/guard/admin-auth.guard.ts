import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrivilegeType } from '@prisma/client';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  constructor(private requiredPrivileges: PrivilegeType[]) {
    super();
  }
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user || !user.admin) {
      throw err || new UnauthorizedException();
    }
    const adminPrivileges = user.admin.privileges.map(
      ({ Privilege }) => Privilege.name,
    );
    console.log(adminPrivileges);
    if (
      !this.requiredPrivileges.every((privilege) =>
        adminPrivileges.includes(privilege),
      )
    ) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
