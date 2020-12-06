import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { BaseUserDetailResponse } from 'src/dto/BaseUserDetailResponse.dto';
import { UserService } from './user.service';

@ApiTags('User - User')
@Controller('user')
// @UseGuards()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() request: Request): Promise<BaseUserDetailResponse> {
    return this.userService.getUser((request as any).user.id);
  }
}
