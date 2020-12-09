import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Req,
  Body,
  Param,
  Post,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { BaseUserDetailResponse } from 'src/dto/BaseUserDetailResponse.dto';
import { UserService } from './user.service';
import { METADATA } from 'src/common/constants/metadata/metadata.constant';
import { USER_LANGUAGE } from 'src/common/constants/user-language.enum';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { LoginUserDto } from 'src/dto/user/LoginUser.dto';

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

  @Post('login')
  @SetMetadata(METADATA.IS_PUBLIC, true)
  login(@Body() model: LoginUserDto): Promise<BaseUserDetailResponse> {
    return this.userService.login(model);
  }

  @Post(':lang')
  @SetMetadata(METADATA.IS_PUBLIC, true)
  createAccount(
    @Body() createUserModel: CreateUserDto,
    @Param('lang') lang: USER_LANGUAGE,
  ): Promise<boolean> {
    return this.userService.registerAccount(createUserModel, lang);
  }
}
