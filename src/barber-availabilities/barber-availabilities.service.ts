import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBarberAvailabilityDto } from './dto/create-barber-availability.dto';
import { UpdateBarberAvailabilityDto } from './dto/update-barber-availability.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BarberAvailabilitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBarberAvailabilityDto: CreateBarberAvailabilityDto) {
    const { barberId, weekday } = createBarberAvailabilityDto;
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
    await this.findOne(id);
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
}
