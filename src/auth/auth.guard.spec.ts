import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../generated/prisma/enums';

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
  it('should reject request with invalid token', async () => {
    const request = {
      headers: {
        authorization: 'Bearer token-invalido',
      },
    };
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;
    jwtServiceMock.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith('token-invalido', {
      secret: 'test-secret',
    });
    expect(prismaMock.user.findFirst).not.toHaveBeenCalled();
  });
  it('should reject token when user is not active', async () => {
    const request = {
      headers: {
        authorization: 'Bearer token-valido',
      },
    };
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;
    jwtServiceMock.verifyAsync.mockResolvedValue({
      sub: 'user-1',
      email: 'cliente@email.com',
      role: UserRole.CUSTOMER,
    });
    prismaMock.user.findFirst.mockResolvedValue(null);
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith('token-valido', {
      secret: 'test-secret',
    });
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'user-1',
        isActive: true,
      },
    });
  });
  it('should allow request with valid token and active user', async () => {
    const request = {
      headers: {
        authorization: 'Bearer token-valido',
      },
    };
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;
    jwtServiceMock.verifyAsync.mockResolvedValue({
      sub: 'user-1',
      email: 'cliente@email.com',
      role: UserRole.CUSTOMER,
    });
    prismaMock.user.findFirst.mockResolvedValue({
      id: 'user-1',
      email: 'cliente@email.com',
      role: UserRole.CUSTOMER,
      isActive: true,
    });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request).toHaveProperty('user', {
      sub: 'user-1',
      email: 'cliente@email.com',
      role: UserRole.CUSTOMER,
    });
    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith('token-valido', {
      secret: 'test-secret',
    });
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'user-1',
        isActive: true,
      },
    });
  });
});
