import { AuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthGuard', () => {
  it('should be defined', () => {
    const jwtService = {
      verifyAsync: jest.fn(),
    } as unknown as JwtService;
    const configService = {
      get: jest.fn().mockReturnValue('test-secret'),
    } as unknown as ConfigService;

    expect(new AuthGuard(jwtService, configService)).toBeDefined();
  });
});
