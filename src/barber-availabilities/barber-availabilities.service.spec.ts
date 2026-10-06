import { BarberAvailabilitiesService } from './barber-availabilities.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, Weekday } from '../generated/prisma/enums';
import { BadRequestException } from '@nestjs/common';

describe('BarberAvailabilitiesService', () => {
  let service: BarberAvailabilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarberAvailabilitiesService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
            barberAvailability: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BarberAvailabilitiesService>(BarberAvailabilitiesService);
  });

  it('should reject availability when end time is before start time', async () => {
    await expect(
      service.create(
        {
          barberId: 'barber-id',
          weekday: Weekday.TUESDAY,
          startTime: '10:00',
          endTime: '09:00',
        },
        {
          sub: 'barber-id',
          role: UserRole.BARBER,
        },
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
