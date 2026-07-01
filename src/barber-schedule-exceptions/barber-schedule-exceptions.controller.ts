import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { BarberScheduleExceptionsService } from './barber-schedule-exceptions.service';
import { CreateBarberScheduleExceptionDto } from './dto/create-barber-schedule-exception.dto';
import { UpdateBarberScheduleExceptionDto } from './dto/update-barber-schedule-exception.dto';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../generated/prisma/enums';
import { BarberScheduleExceptionOwnershipGuard } from '../auth/guards/barber-schedule-exception-ownership.guard';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
  };
};

@Controller('barber-schedule-exceptions')
export class BarberScheduleExceptionsController {
  constructor(private readonly barberScheduleExceptionsService: BarberScheduleExceptionsService) {}

  @ApiOperation({ summary: 'Cria excecoes' })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Permissao insuficiente' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BARBER)
  @Post()
  create(@Body() createBarberScheduleExceptionDto: CreateBarberScheduleExceptionDto) {
    return this.barberScheduleExceptionsService.create(createBarberScheduleExceptionDto);
  }

  @ApiOperation({ summary: 'Busca excecoes de agenda de um barbeiro especifico' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard)
  @Get('barber/:barberId')
  findByBarber(@Param('barberId') barberId: string) {
    return this.barberScheduleExceptionsService.findByBarber(barberId);
  }

  @ApiOperation({ summary: 'Busca minhas excecoes de agenda' })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Permissao insuficiente' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BARBER)
  @Get('me')
  findMe(@Req() request: AuthenticatedRequest) {
    return this.barberScheduleExceptionsService.findByBarber(request.user.sub);
  }

  @ApiOperation({ summary: 'Busca excecao especifica de um barbeiro' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.barberScheduleExceptionsService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualiza a excecao' })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Permissao insuficiente' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard, BarberScheduleExceptionOwnershipGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBarberScheduleExceptionDto: UpdateBarberScheduleExceptionDto,
  ) {
    return this.barberScheduleExceptionsService.update(id, updateBarberScheduleExceptionDto);
  }

  @ApiOperation({ summary: 'Remove a excecao' })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Permissao insuficiente' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard, BarberScheduleExceptionOwnershipGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.barberScheduleExceptionsService.remove(id);
  }
}
