import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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
  it('should reject login when user doest not exit', async () => {
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
    expect(jwtServiceMock.sign).not.toHaveBeenCalled();
  });
});
