import { BarberAvailabilitiesService } from './barber-availabilities.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, Weekday } from '../generated/prisma/enums';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('BarberAvailabilitiesService', () => {
  let service: BarberAvailabilitiesService;

  let prismaMock: {
    user: {
      findUnique: jest.Mock;
    };
    barberAvailability: {
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
      },
      barberAvailability: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarberAvailabilitiesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
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

  it('should reject availability when start and end times are equal', async () => {
    await expect(
      service.create(
        {
          barberId: 'barber-id',
          weekday: Weekday.TUESDAY,
          startTime: '10:00',
          endTime: '10:00',
        },
        {
          sub: 'barber-id',
          role: UserRole.BARBER,
        },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject duplicate availability for the same barber and weekday', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'barber-id',
      role: UserRole.BARBER,
      isActive: true,
    });
    prismaMock.barberAvailability.findFirst.mockResolvedValue({
      id: 'availability-id',
      barberId: 'barber-id',
      weekday: Weekday.TUESDAY,
      startTime: '09:00',
      endTime: '18:00',
    });
    await expect(
      service.create(
        {
          barberId: 'barber-id',
          weekday: Weekday.TUESDAY,
          startTime: '09:00',
          endTime: '18:00',
        },
        {
          sub: 'barber-id',
          role: UserRole.BARBER,
        },
      ),
    ).rejects.toThrow(ConflictException);

    expect(prismaMock.barberAvailability.create).not.toHaveBeenCalled();
  });

  it('should create availability when the barber is active and no availability exists for the weekday', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'barber-id',
      role: UserRole.BARBER,
      isActive: true,
    });
    prismaMock.barberAvailability.findFirst.mockResolvedValue(null);
    const createdAvailability = {
      id: 'availability-id',
      barberId: 'barber-id',
      weekday: Weekday.TUESDAY,
      startTime: '09:00',
      endTime: '18:00',
    };
    prismaMock.barberAvailability.create.mockResolvedValue(createdAvailability);
    await expect(
      service.create(
        {
          barberId: 'barber-id',
          weekday: Weekday.TUESDAY,
          startTime: '09:00',
          endTime: '18:00',
        },
        {
          sub: 'barber-id',
          role: UserRole.BARBER,
        },
      ),
    ).resolves.toEqual(createdAvailability);
    expect(prismaMock.barberAvailability.create).toHaveBeenCalledWith({
      data: {
        barberId: 'barber-id',
        weekday: Weekday.TUESDAY,
        startTime: '09:00',
        endTime: '18:00',
      },
    });
  });

  it('should reject availability creation for another barber', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'other-barber-id',
      role: UserRole.BARBER,
      isActive: true,
    });
    await expect(
      service.create(
        {
          barberId: 'other-barber-id',
          weekday: Weekday.TUESDAY,
          startTime: '09:00',
          endTime: '18:00',
        },
        {
          sub: 'barber-id',
          role: UserRole.BARBER,
        },
      ),
    ).rejects.toThrow(ForbiddenException);
    expect(prismaMock.barberAvailability.create).not.toHaveBeenCalled();
  });

  it('should allow an admin to create availability for another barber', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'barber-id',
      role: UserRole.BARBER,
      isActive: true,
    });
    prismaMock.barberAvailability.findFirst.mockResolvedValue(null);
    const createdAvailability = {
      id: 'availability-id',
      barberId: 'barber-id',
      weekday: Weekday.TUESDAY,
      startTime: '09:00',
      endTime: '18:00',
    };
    prismaMock.barberAvailability.create.mockResolvedValue(createdAvailability);
    await expect(
      service.create(
        {
          barberId: 'barber-id',
          weekday: Weekday.TUESDAY,
          startTime: '09:00',
          endTime: '18:00',
        },
        {
          sub: 'admin-id',
          role: UserRole.ADMIN,
        },
      ),
    ).resolves.toEqual(createdAvailability);
    expect(prismaMock.barberAvailability.create).toHaveBeenCalledWith({
      data: {
        barberId: 'barber-id',
        weekday: Weekday.TUESDAY,
        startTime: '09:00',
        endTime: '18:00',
      },
    });
  });

  it('should reject availability creation for an inactive barber', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'barber-id',
      role: UserRole.BARBER,
      isActive: false,
    });
    await expect(
      service.create(
        {
          barberId: 'barber-id',
          weekday: Weekday.TUESDAY,
          startTime: '09:00',
          endTime: '10:00',
        },
        {
          sub: 'barber-id',
          role: UserRole.BARBER,
        },
      ),
    ).rejects.toThrow(NotFoundException);
    expect(prismaMock.barberAvailability.create).not.toHaveBeenCalled();
  });

  it('should reject availability creation for a nonexistent barber', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(
      service.create(
        {
          barberId: 'barber-id',
          weekday: Weekday.TUESDAY,
          startTime: '09:00',
          endTime: '18:00',
        },
        {
          sub: 'barber-id',
          role: UserRole.BARBER,
        },
      ),
    ).rejects.toThrow(NotFoundException);
    expect(prismaMock.barberAvailability.create).not.toHaveBeenCalled();
  });

  it('should reject availability creation for a customer', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'customer-id',
      role: UserRole.CUSTOMER,
      isActive: true,
    });
    await expect(
      service.create(
        {
          barberId: 'customer-id',
          weekday: Weekday.TUESDAY,
          startTime: '09:00',
          endTime: '10:00',
        },
        {
          sub: 'customer-id',
          role: UserRole.CUSTOMER,
        },
      ),
    ).rejects.toThrow(BadRequestException);
    expect(prismaMock.barberAvailability.create).not.toHaveBeenCalled();
  });

  it('should reject availability update when end time is before start time', async () => {
    const createdAvailability = {
      id: 'availability-id',
      barberId: 'barber-id',
      weekday: Weekday.TUESDAY,
      startTime: '09:00',
      endTime: '10:00',
    };
    prismaMock.barberAvailability.findUnique.mockResolvedValue(createdAvailability);

    await expect(service.update('availability-id', { endTime: '08:00' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should reject availability update when start and end times are equal', async () => {
    const createdAvailability = {
      id: 'availability-id',
      barberId: 'barber-id',
      weekday: Weekday.TUESDAY,
      startTime: '09:00',
      endTime: '10:00',
    };
    prismaMock.barberAvailability.findUnique.mockResolvedValue(createdAvailability);
    await expect(service.update('availability-id', { endTime: '09:00' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should reject update for a nonexistent availability', async () => {
    prismaMock.barberAvailability.findUnique.mockResolvedValue(null);
    await expect(service.update('availability-id', { endTime: '18:00' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should reject availability update when another availability exists for the same barber and weekday', async () => {
    const createdAvailability = {
      id: 'availability-id',
      barberId: 'barber-id',
      weekday: Weekday.TUESDAY,
      startTime: '09:00',
      endTime: '10:00',
    };
    const existingAvailability = {
      id: 'another-availability-id',
      barberId: 'barber-id',
      weekday: Weekday.WEDNESDAY,
      startTime: '09:00',
      endTime: '10:00',
    };
    prismaMock.barberAvailability.findUnique.mockResolvedValue(createdAvailability);
    prismaMock.barberAvailability.findFirst.mockResolvedValue(existingAvailability);
    await expect(service.update('availability-id', { weekday: Weekday.WEDNESDAY })).rejects.toThrow(
      ConflictException,
    );
  });

  it('should update availability when the weekday lookup returns the same availability', async () => {
    const createdAvailability = {
      id: 'availability-id',
      barberId: 'barber-id',
      weekday: Weekday.TUESDAY,
      startTime: '09:00',
      endTime: '18:00',
    };
    const updatedAvailability = {
      ...createdAvailability,
      endTime: '10:00',
    };
    prismaMock.barberAvailability.findUnique.mockResolvedValue(createdAvailability);
    prismaMock.barberAvailability.findFirst.mockResolvedValue(createdAvailability);
    prismaMock.barberAvailability.update.mockResolvedValue(updatedAvailability);

    await expect(service.update('availability-id', { endTime: '10:00' })).resolves.toEqual(
      updatedAvailability,
    );
    expect(prismaMock.barberAvailability.update).toHaveBeenCalledWith({
      where: { id: 'availability-id' },
      data: { endTime: '10:00' },
    });
  });

  it('should update availability when no availability exists for the target weekday', async () => {
    const createdAvailability = {
      id: 'availability-id',
      barberId: 'barber-id',
      weekday: Weekday.TUESDAY,
      startTime: '09:00',
      endTime: '18:00',
    };
    const updatedAvailability = {
      ...createdAvailability,
      weekday: Weekday.WEDNESDAY,
    };
    prismaMock.barberAvailability.findUnique.mockResolvedValue(createdAvailability);
    prismaMock.barberAvailability.findFirst.mockResolvedValue(null);
    prismaMock.barberAvailability.update.mockResolvedValue(updatedAvailability);

    await expect(
      service.update('availability-id', { weekday: Weekday.WEDNESDAY }),
    ).resolves.toEqual(updatedAvailability);
    expect(prismaMock.barberAvailability.update).toHaveBeenCalledWith({
      where: { id: 'availability-id' },
      data: { weekday: Weekday.WEDNESDAY },
    });
  });

  it('should reject removal of a nonexistent availability', async () => {
    prismaMock.barberAvailability.findUnique.mockResolvedValue(null);
    await expect(service.remove('availability-id')).rejects.toThrow(NotFoundException);
  });

  it('should remove an existing availability', async () => {
    const createdAvailability = {
      id: 'availability-id',
      barberId: 'barber-id',
      weekday: Weekday.TUESDAY,
      startTime: '09:00',
      endTime: '18:00',
    };
    prismaMock.barberAvailability.findUnique.mockResolvedValue(createdAvailability);
    prismaMock.barberAvailability.delete.mockResolvedValue(createdAvailability);
    await expect(service.remove('availability-id')).resolves.toEqual(createdAvailability);
    expect(prismaMock.barberAvailability.delete).toHaveBeenCalledWith({
      where: { id: 'availability-id' },
    });
  });

  it('should return an existing availability by id', async () => {
    const createdAvalability = {
      id: 'availability-id',
      barberId: 'barber-id',
      weekday: Weekday.TUESDAY,
      startTime: '09:00',
      endTime: '18:00',
    };
    prismaMock.barberAvailability.findUnique.mockResolvedValue(createdAvalability);
    await expect(service.findOne('availability-id')).resolves.toEqual(createdAvalability);
    expect(prismaMock.barberAvailability.findUnique).toHaveBeenCalledWith({
      where: { id: 'availability-id' },
    });
  });

  it('should reject lookup of a nonexistent availability', async () => {
    prismaMock.barberAvailability.findUnique.mockResolvedValue(null);
    await expect(service.findOne('availability-id')).rejects.toThrow(NotFoundException);
  });

  it('should return all availabilities', async () => {
    const availabilities = [
      {
        id: 'availability-id',
        barberId: 'barber-id',
        weekday: Weekday.TUESDAY,
        startTime: '09:00',
        endTime: '18:00',
      },
    ];
    prismaMock.barberAvailability.findMany.mockResolvedValue(availabilities);
    await expect(service.findAll()).resolves.toEqual(availabilities);
    expect(prismaMock.barberAvailability.findMany).toHaveBeenCalledWith();
  });

  it('should return availabilities for the specified barber', async () => {
    const availabilities = [
      {
        id: 'availability-id',
        barberId: 'barber-id',
        weekday: Weekday.TUESDAY,
        startTime: '09:00',
        endTime: '18:00',
      },
    ];
    prismaMock.barberAvailability.findMany.mockResolvedValue(availabilities);
    await expect(service.findByBarber('barber-id')).resolves.toEqual(availabilities);
    expect(prismaMock.barberAvailability.findMany).toHaveBeenCalledWith({
      where: { barberId: 'barber-id' },
    });
  });
});
