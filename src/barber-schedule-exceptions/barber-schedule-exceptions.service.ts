import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBarberScheduleExceptionDto } from './dto/create-barber-schedule-exception.dto';
import { UpdateBarberScheduleExceptionDto } from './dto/update-barber-schedule-exception.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../generated/prisma/enums';

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
    return this.prisma.barberScheduleException.create({
      data: createBarberScheduleExceptionDto,
    });
  }

  async findByBarber(barberId: string) {
    return this.prisma.barberScheduleException.findMany({
      where: { barberId },
      orderBy: {
        startsAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const barberSchedule = await this.prisma.barberScheduleException.findUnique({
      where: { id },
    });
    if (!barberSchedule) {
      throw new NotFoundException();
    }
    return barberSchedule;
  }

  async update(id: string, updateBarberScheduleExceptionDto: UpdateBarberScheduleExceptionDto) {
    const schedule = await this.findOne(id);
    const startsAt = updateBarberScheduleExceptionDto.startsAt ?? schedule.startsAt;
    const endsAt = updateBarberScheduleExceptionDto.endsAt ?? schedule.endsAt;

    this.validateDateRange(startsAt, endsAt);

    const updateSchedule = await this.prisma.barberScheduleException.update({
      where: { id },
      data: updateBarberScheduleExceptionDto,
    });
    return updateSchedule;
  }

  async remove(id: string) {
    await this.findOne(id);
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
}
