import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationRequest } from 'src/common/dtos/pagination.dto';
import { UserRequestDto } from './user/user-request.dto';

export class GetRequest extends PaginationRequest {
  @ApiPropertyOptional()
  search: string;

  @ApiPropertyOptional()
  status: string;

  @ApiPropertyOptional()
  searchBy?: string;

  @ApiPropertyOptional()
  searchKeyword?: string;

  @ApiPropertyOptional()
  order?: UserRequestDto;
}
