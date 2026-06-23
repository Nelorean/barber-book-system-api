import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Teste da Silva Sauro',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '11888888888',
  })
  @IsOptional()
  @IsString()
  @Length(10, 11)
  @Matches(/^\d+$/)
  phone?: string;
}
