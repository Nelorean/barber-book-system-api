import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { BarberScheduleExceptionType } from '../../generated/prisma/enums';

export class CreateBarberScheduleExceptionDto {
  @ApiProperty({
    example: 'uuid-do-barbeiro',
  })
  @IsNotEmpty()
  @IsString()
  barberId!: string;

  @ApiPropertyOptional({
    example: 'razao da excecao',
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({
    example: '2026-07-10T09:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startsAt!: string;

  @ApiProperty({
    example: '2026-07-10T18:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endsAt!: string;

  @ApiProperty({
    enum: BarberScheduleExceptionType,
    example: BarberScheduleExceptionType.UNAVAILABLE,
  })
  @IsEnum(BarberScheduleExceptionType)
  type!: BarberScheduleExceptionType;
}
