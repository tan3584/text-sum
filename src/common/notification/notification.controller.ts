import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { Request } from 'express';
import { RegisterToken } from './dto/register-token.dto';
import { PaginationRequest } from 'src/common/dtos/pagination.dto';
import { NotificationInstance } from 'src/entities/notification-instance/notification-instance.entity';
import { RESPONSE_EXPLAINATION } from 'src/common/constants/response-messages.enum';

@Controller('notification')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Common - Noti')
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notiService: NotificationService) {}

  @Post('register-token')
  register(@Body() body: RegisterToken, @Req() request: Request): Promise<any> {
    return this.notiService.registerToken(
      body.token,
      (request as any).user,
      body.platform,
    );
  }

  @Get()
  @ApiOkResponse({
    description: RESPONSE_EXPLAINATION.LIST_SPECIAL,
  })
  list(
    @Query() filter: PaginationRequest,
    @Req() request: Request,
  ): Promise<[NotificationInstance[], number, number]> {
    return this.notiService.listInstance((request as any).user, filter);
  }

  @Put('read/:id')
  readNotification(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<boolean> {
    return this.notiService.readNoti(id, (request as any).user);
  }
}
