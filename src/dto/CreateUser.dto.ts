import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  @Transform(it => it.toLowerCase())
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiPropertyOptional()
  phoneNumber?: string;
}
