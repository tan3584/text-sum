import { IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { USER_STATUS } from 'src/entities/enums/userStatus.enum';

export class UserRequestDto {
  @ApiPropertyOptional()
  id: number;

  @ApiPropertyOptional()
  updatedDate: Date;

  @ApiPropertyOptional()
  createdDate: Date;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  phoneNumber: string;

  @ApiPropertyOptional()
  firstName: string;

  @ApiPropertyOptional()
  lastName: string;

  @IsEnum(USER_STATUS)
  @ApiPropertyOptional()
  status: USER_STATUS;
}
