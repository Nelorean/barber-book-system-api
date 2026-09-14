import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  const jwtServiceMock = {
    verifyAsync: jest.fn(),
  };
  const prismaMock = {
    user: {
      findFirst: jest.fn(),
    },
  };
  const configServiceMock = {
    get: jest.fn().mockReturnValue('test-secret'),
  } as unknown as ConfigService;

  beforeEach(() => {
    jest.clearAllMocks();

    guard = new AuthGuard(
      jwtServiceMock as unknown as JwtService,
      configServiceMock,
      prismaMock as unknown as PrismaService,
    );
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
  it('should reject request without token', async () => {
    const request = {
      headers: {},
    };
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtServiceMock.verifyAsync).not.toHaveBeenCalled();
    expect(prismaMock.user.findFirst).not.toHaveBeenCalled();
  });
});
