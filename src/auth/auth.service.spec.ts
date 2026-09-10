import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../generated/prisma/enums';

jest.mock('bcrypt');

const prismaMock = {
  user: {
    findFirst: jest.fn(),
  },
};
const jwtServiceMock = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject login when user doest not exist', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    const loginDto = {
      email: 'inexistente@email.com',
      password: 'Senha123',
    };

    await expect(service.login(loginDto)).rejects.toBeInstanceOf(UnauthorizedException);

    expect(jwtServiceMock.sign).not.toHaveBeenCalled();
  });

  it('should reject login when password is invalid', async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      passwordHash: 'hashed-password',
    });

    type ComparePassword = (data: string | Buffer, encrypted: string) => Promise<boolean>;

    const bcryptCompareMock = bcrypt.compare as jest.MockedFunction<ComparePassword>;
    bcryptCompareMock.mockResolvedValue(false);

    const loginDto = {
      email: 'cliente@email.com',
      password: 'SenhaErrada123',
    };

    await expect(service.login(loginDto)).rejects.toBeInstanceOf(UnauthorizedException);

    expect(bcryptCompareMock).toHaveBeenCalledWith(loginDto.password, 'hashed-password');
  });

  it('should allow login', async () => {
    const loginDto = {
      email: 'cliente@email.com',
      password: 'Senha123',
    };
    prismaMock.user.findFirst.mockResolvedValue({
      id: 'user-1',
      name: 'Cliente Teste',
      email: 'cliente@email.com',
      role: UserRole.CUSTOMER,
      passwordHash: 'hashed-password',
    });

    type ComparePassword = (data: string | Buffer, encrypted: string) => Promise<boolean>;

    const bcryptCompareMock = bcrypt.compare as jest.MockedFunction<ComparePassword>;
    bcryptCompareMock.mockResolvedValue(true);

    jwtServiceMock.sign.mockReturnValue('token-de-teste');

    const result = await service.login(loginDto);

    expect(bcryptCompareMock).toHaveBeenCalledWith(loginDto.password, 'hashed-password');

    expect(jwtServiceMock.sign).toHaveBeenCalledWith({
      sub: 'user-1',
      email: 'cliente@email.com',
      role: UserRole.CUSTOMER,
    });

    expect(result).toEqual({
      accessToken: 'token-de-teste',
      user: {
        id: 'user-1',
        name: 'Cliente Teste',
        email: 'cliente@email.com',
        role: UserRole.CUSTOMER,
      },
    });

    expect(result.user).not.toHaveProperty('passwordHash');
  });
});
