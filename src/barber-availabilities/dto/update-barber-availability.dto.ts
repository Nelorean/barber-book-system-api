import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Weekday } from '../../generated/prisma/enums';

export class UpdateBarberAvailabilityDto {
  @ApiPropertyOptional({
    enum: Weekday,
    example: Weekday.THURSDAY,
  })
  @IsOptional()
  @IsEnum(Weekday)
  weekday?: Weekday;

  @ApiPropertyOptional({
    example: '10:00',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime?: string;

  @ApiPropertyOptional({
    example: '17:00',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  endTime?: string;
}
