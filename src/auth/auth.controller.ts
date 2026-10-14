import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Realiza login do usuário' })
  @ApiOkResponse({ description: 'Login realizado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Credencias inválidas' })
  login(@Body() loginDto: LoginDto): Promise<unknown> {
    return this.authService.login(loginDto);
  }
}
