import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBarberScheduleExceptionDto } from './dto/create-barber-schedule-exception.dto';
import { UpdateBarberScheduleExceptionDto } from './dto/update-barber-schedule-exception.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../generated/prisma/enums';
import type { BarberScheduleException } from '../generated/prisma/client';

type ScheduleExceptionViewer = {
  sub: string;
  role: UserRole;
};
type PublicBarberScheduleException = Omit<BarberScheduleException, 'reason'>;

@Injectable()
export class BarberScheduleExceptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBarberScheduleExceptionDto: CreateBarberScheduleExceptionDto) {
    const { barberId, startsAt, endsAt } = createBarberScheduleExceptionDto;
    this.validateDateRange(startsAt, endsAt);
    const barber = await this.prisma.user.findUnique({
      where: { id: barberId },
    });
    if (!barber || !barber.isActive) {
      throw new NotFoundException();
    }
    if (barber.role === UserRole.CUSTOMER) {
      throw new BadRequestException('User must be a barber or admin');
    }
    await this.validateScheduleConflict(barberId, startsAt, endsAt);

    return this.prisma.barberScheduleException.create({
      data: createBarberScheduleExceptionDto,
    });
  }

  async findByBarber(barberId: string, viewer?: ScheduleExceptionViewer) {
    const canViewReason = viewer?.role === UserRole.ADMIN || viewer?.sub === barberId;
    if (canViewReason) {
      return this.prisma.barberScheduleException.findMany({
        where: { barberId },
        orderBy: {
          startsAt: 'asc',
        },
      });
    }
    return this.prisma.barberScheduleException.findMany({
      where: { barberId },
      orderBy: {
        startsAt: 'asc',
      },
      omit: { reason: true },
    });
  }

  async findOne(id: string, viewer?: ScheduleExceptionViewer) {
    const barberSchedule = await this.findScheduleOrThrow(id);
    const canViewReason =
      viewer?.role === UserRole.ADMIN || viewer?.sub === barberSchedule.barberId;
    if (canViewReason) {
      return barberSchedule;
    }
    return this.removeReason(barberSchedule);
  }

  async update(id: string, updateBarberScheduleExceptionDto: UpdateBarberScheduleExceptionDto) {
    const schedule = await this.findScheduleOrThrow(id);
    const startsAt = updateBarberScheduleExceptionDto.startsAt ?? schedule.startsAt;
    const endsAt = updateBarberScheduleExceptionDto.endsAt ?? schedule.endsAt;

    this.validateDateRange(startsAt, endsAt);
    await this.validateScheduleConflict(schedule.barberId, startsAt, endsAt, id);

    const updateSchedule = await this.prisma.barberScheduleException.update({
      where: { id },
      data: updateBarberScheduleExceptionDto,
    });
    return updateSchedule;
  }

  async remove(id: string) {
    await this.findScheduleOrThrow(id);
    const deletedSchedule = await this.prisma.barberScheduleException.delete({
      where: { id },
    });
    return deletedSchedule;
  }

  private validateDateRange(startsAt: string | Date, endsAt: string | Date): void {
    const startDate = new Date(startsAt);
    const endDate = new Date(endsAt);

    if (startDate >= endDate) {
      throw new BadRequestException('startsAt must be before endsAt');
    }
  }
  private async validateScheduleConflict(
    barberId: string,
    startsAt: string | Date,
    endsAt: string | Date,
    ignoreId?: string,
  ): Promise<void> {
    const startDate = new Date(startsAt);
    const endDate = new Date(endsAt);
    const where = {
      barberId,
      startsAt: { lt: endDate },
      endsAt: { gt: startDate },
    };
    if (ignoreId) {
      Object.assign(where, {
        id: { not: ignoreId },
      });
    }
    const conflictingSchedule = await this.prisma.barberScheduleException.findFirst({
      where,
    });
    if (conflictingSchedule) {
      throw new ConflictException('Schedule exception conflicts with another exception');
    }
  }
  private removeReason(schedule: BarberScheduleException): PublicBarberScheduleException {
    const { reason, ...publicSchedule } = schedule;
    void reason;

    return publicSchedule;
  }
  private async findScheduleOrThrow(id: string): Promise<BarberScheduleException> {
    const schedule = await this.prisma.barberScheduleException.findUnique({
      where: { id },
    });
    if (!schedule) {
      throw new NotFoundException();
    }
    return schedule;
  }
}
