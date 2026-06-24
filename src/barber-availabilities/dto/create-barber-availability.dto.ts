import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Weekday } from '../../generated/prisma/enums';

export class CreateBarberAvailabilityDto {
  @ApiProperty({
    example: 'uuid-do-barbeiro',
  })
  @IsString()
  @IsNotEmpty()
  barberId!: string;

  @ApiProperty({
    enum: Weekday,
    example: Weekday.TUESDAY,
  })
  @IsEnum(Weekday)
  weekday!: Weekday;

  @ApiProperty({
    example: '09:00',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime!: string;

  @ApiProperty({
    example: '18:00',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  endTime!: string;
}
