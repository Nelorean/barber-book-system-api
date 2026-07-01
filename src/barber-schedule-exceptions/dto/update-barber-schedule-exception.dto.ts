import { ApiPropertyOptional } from '@nestjs/swagger';
import { BarberScheduleExceptionType } from '../../generated/prisma/enums';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBarberScheduleExceptionDto {
  @ApiPropertyOptional({
    enum: BarberScheduleExceptionType,
    example: BarberScheduleExceptionType.EXTRA_AVAILABLE,
  })
  @IsOptional()
  @IsEnum(BarberScheduleExceptionType)
  type?: BarberScheduleExceptionType;

  @ApiPropertyOptional({
    example: 'razao da excecao',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    example: '2026-07-10T09:00:00.000Z',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional({
    example: '2026-07-10T18:00:00.000Z',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  endsAt?: string;
}
