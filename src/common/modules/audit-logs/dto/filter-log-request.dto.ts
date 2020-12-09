import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationRequest } from 'src/common/dtos/pagination.dto';

export class FilterLogRequestDto extends PaginationRequest {
  @IsOptional()
  @ApiPropertyOptional()
  userId?: number;

  @IsOptional()
  @ApiPropertyOptional()
  search?: string;
}
