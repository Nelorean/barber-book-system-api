import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Teste da Silva',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'testeemail@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Senha123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  password!: string;

  @ApiPropertyOptional({
    example: '11999999999',
  })
  @IsOptional()
  @IsString()
  @Length(10, 11)
  @Matches(/^\d+$/)
  phone?: string;
}
