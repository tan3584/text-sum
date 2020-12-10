import { ApiProperty } from '@nestjs/swagger';

export class CreateComment {
  @ApiProperty()
  content: string;
}
