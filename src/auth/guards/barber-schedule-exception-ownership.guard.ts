import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UserRole } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';

type ScheduleRequest = {
  user?: {
    sub: string;
    role: UserRole;
  };
  params: {
    id?: string;
  };
};

@Injectable()
export class BarberScheduleExceptionOwnershipGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ScheduleRequest>();
    const user = request.user;
    const scheduleId = request.params.id;
    if (!user || !scheduleId) {
      throw new ForbiddenException();
    }
    const schedule = await this.prisma.barberScheduleException.findUnique({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new ForbiddenException();
    }
    if (schedule.barberId === user.sub) {
      return true;
    }
    if (user.role === UserRole.ADMIN) {
      return true;
    }
    throw new ForbiddenException();
  }
}
