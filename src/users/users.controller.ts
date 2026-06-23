import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserOwnershipGuard } from '../auth/guards/user-ownership.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Cria usuario' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista de usuarios ativos' })
  @ApiForbiddenResponse({ description: 'Permissao insuficiente' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Busca usuario por id' })
  @ApiForbiddenResponse({ description: 'Permissao insuficiente' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard, UserOwnershipGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza usuario' })
  @ApiForbiddenResponse({ description: 'Permissao insuficiente' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard, UserOwnershipGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove usuario' })
  @ApiForbiddenResponse({ description: 'Permissao insuficiente' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou invalido' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
