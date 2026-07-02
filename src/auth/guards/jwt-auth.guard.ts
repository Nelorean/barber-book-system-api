import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '../../generated/prisma/enums';

type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};
type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtSecret: string;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is required');
    }

    this.jwtSecret = jwtSecret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.jwtSecret,
      });
      const user = await this.prisma.user.findFirst({
        where: {
          id: payload.sub,
          isActive: true,
        },
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      request.user = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
