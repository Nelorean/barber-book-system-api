import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { BarberAvailabilitiesService } from './barber-availabilities.service';
import { CreateBarberAvailabilityDto } from './dto/create-barber-availability.dto';
import { UpdateBarberAvailabilityDto } from './dto/update-barber-availability.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../generated/prisma/enums';
import { BarberAvailabilityOwnershipGuard } from '../auth/guards/barber-availability-ownership.guard';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
    role: UserRole;
  };
};

@ApiTags('BarberAvailabilities')
@Controller('barber-availabilities')
export class BarberAvailabilitiesController {
  constructor(private readonly barberAvailabilitiesService: BarberAvailabilitiesService) {}

  @ApiOperation({ summary: 'Cria disponibilidade' })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Permissao insuficiente' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BARBER)
  @Post()
  create(
    @Body() createBarberAvailabilityDto: CreateBarberAvailabilityDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.barberAvailabilitiesService.create(createBarberAvailabilityDto, request.user);
  }

  @ApiOperation({ summary: 'Lista todas as disponibilidades' })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Permissao insuficiente' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.barberAvailabilitiesService.findAll();
  }

  @ApiOperation({ summary: 'Lista disponibilidades de um barbeiro' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard)
  @Get('barber/:barberId')
  findByBarber(@Param('barberId') barberId: string) {
    return this.barberAvailabilitiesService.findByBarber(barberId);
  }

  @ApiOperation({ summary: 'Busca disponibilidade por id' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.barberAvailabilitiesService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualiza disponibilidade' })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Permissao insuficiente' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard, BarberAvailabilityOwnershipGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBarberAvailabilityDto: UpdateBarberAvailabilityDto,
  ) {
    return this.barberAvailabilitiesService.update(id, updateBarberAvailabilityDto);
  }

  @ApiOperation({ summary: 'Remove disponibilidade' })
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Permissao insuficiente' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard, BarberAvailabilityOwnershipGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.barberAvailabilitiesService.remove(id);
  }
}
