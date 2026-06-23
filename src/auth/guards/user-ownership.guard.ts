import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UserRole } from '../../generated/prisma/enums';

type OwnershipRequest = {
  user?: {
    sub: string;
    role: UserRole;
  };
  params: {
    id?: string;
  };
};

@Injectable()
export class UserOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<OwnershipRequest>();
    const user = request.user;
    const requestedUserId = request.params.id;

    if (!user || !requestedUserId) {
      throw new ForbiddenException();
    }
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    if (user.sub === requestedUserId) {
      return true;
    }
    throw new ForbiddenException();
  }
}
