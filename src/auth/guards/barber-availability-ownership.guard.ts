import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '../../generated/prisma/enums';

type AvailabilityRequest = {
  user?: {
    sub: string;
    role: UserRole;
  };
  params: {
    id?: string;
  };
};

@Injectable()
export class BarberAvailabilityOwnershipGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AvailabilityRequest>();
    const user = request.user;
    const availabilityId = request.params.id;
    if (!user || !availabilityId) {
      throw new ForbiddenException();
    }
    const availability = await this.prisma.barberAvailability.findUnique({
      where: { id: availabilityId },
    });
    if (!availability) {
      throw new ForbiddenException();
    }
    if (availability.barberId === user.sub) {
      return true;
    }
    if (user.role === UserRole.ADMIN) {
      return true;
    }
    throw new ForbiddenException();
  }
}
