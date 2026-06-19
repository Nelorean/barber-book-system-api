import { NotFoundException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }
    const { password, ...userData } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        ...userData,
        passwordHash,
      },
      omit: {
        passwordHash: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { isActive: true },
      omit: {
        passwordHash: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, isActive: true },
      omit: { passwordHash: true },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      omit: {
        passwordHash: true,
      },
    });
    return updatedUser;
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedUser = await this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
      },
      omit: {
        passwordHash: true,
      },
    });
    return deletedUser;
  }
}
