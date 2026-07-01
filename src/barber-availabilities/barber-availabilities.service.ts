import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBarberAvailabilityDto } from './dto/create-barber-availability.dto';
import { UpdateBarberAvailabilityDto } from './dto/update-barber-availability.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../generated/prisma/enums';

@Injectable()
export class BarberAvailabilitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBarberAvailabilityDto: CreateBarberAvailabilityDto) {
    const { barberId, weekday, startTime, endTime } = createBarberAvailabilityDto;
    this.validateTimeRange(startTime, endTime);
    const barber = await this.prisma.user.findUnique({
      where: { id: barberId },
    });

    if (!barber || !barber.isActive) {
      throw new NotFoundException();
    }
    if (barber.role === UserRole.CUSTOMER) {
      throw new BadRequestException('User must be a barber or admin');
    }

    const existingAvailability = await this.prisma.barberAvailability.findFirst({
      where: { barberId, weekday },
    });
    if (existingAvailability) {
      throw new ConflictException('Availability already exists for this barber and weekday');
    }

    return this.prisma.barberAvailability.create({
      data: createBarberAvailabilityDto,
    });
  }

  async findAll() {
    return this.prisma.barberAvailability.findMany();
  }

  async findOne(id: string) {
    const availability = await this.prisma.barberAvailability.findUnique({
      where: { id },
    });

    if (!availability) {
      throw new NotFoundException();
    }
    return availability;
  }

  async update(id: string, updateBarberAvailabilityDto: UpdateBarberAvailabilityDto) {
    const availability = await this.findOne(id);
    const startTime = updateBarberAvailabilityDto.startTime ?? availability.startTime;
    const endTime = updateBarberAvailabilityDto.endTime ?? availability.endTime;

    this.validateTimeRange(startTime, endTime);

    const updatedAvailability = await this.prisma.barberAvailability.update({
      where: { id },
      data: updateBarberAvailabilityDto,
    });
    return updatedAvailability;
  }

  async findByBarber(barberId: string) {
    return this.prisma.barberAvailability.findMany({
      where: { barberId },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    const deletedAvailability = await this.prisma.barberAvailability.delete({
      where: { id },
    });
    return deletedAvailability;
  }
  private validateTimeRange(startTime: string, endTime: string): void {
    if (startTime >= endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }
  }
}
