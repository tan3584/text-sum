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
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { BaseUserDetailResponse } from 'src/dto/BaseUserDetailResponse.dto';
import { UserService } from './user.service';
import { METADATA } from 'src/common/constants/metadata/metadata.constant';
import { USER_LANGUAGE } from 'src/common/constants/user-language.enum';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { LoginUserDto } from 'src/dto/user/LoginUser.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChangePassword } from 'src/dto/user/ChangePassword.dto';
import { ResetPassword } from 'src/dto/user/ResetPassword.dto';
import { CheckToken } from 'src/dto/user/CheckToken.dto';

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

  @ApiBearerAuth()
  @Post(':id/change-password')
  async changePassword(
    @Body() model: ChangePassword,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return this.userService.changePassword(id, model);
  }

  @Get('forgot-password/:lang')
  @SetMetadata(METADATA.IS_PUBLIC, true)
  async forgotPassword(
    @Query('email') email: string,
    @Param('lang') lang: USER_LANGUAGE,
  ): Promise<boolean> {
    return this.userService.forgotPassword(email, lang);
  }

  @Post('reset-password')
  @SetMetadata(METADATA.IS_PUBLIC, true)
  async resetPassword(@Body() model: ResetPassword): Promise<boolean> {
    return this.userService.resetPassword(model);
  }

  @ApiBearerAuth()
  @Post('check-token')
  async verifyToken(
    @Body() model: CheckToken,
  ): Promise<BaseUserDetailResponse> {
    const result = await this.userService.verifyToken(model.token);
    return result;
  }

  @ApiBearerAuth()
  @SetMetadata(METADATA.IS_PUBLIC, true)
  @Post('check-reset-token')
  async verifyResetToken(
    @Body() model: CheckToken,
  ): Promise<BaseUserDetailResponse> {
    const result = await this.userService.verifyResetToken(model.token);
    return result;
  }
}
