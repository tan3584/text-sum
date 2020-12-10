import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty()
  subject: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
