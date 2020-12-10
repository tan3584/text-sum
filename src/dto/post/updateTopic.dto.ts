import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateTopicDto {
  topicId: number;

  @ApiProperty()
  @Transform(it => it.toLowerCase())
  subject: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
