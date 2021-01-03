import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Body,
  Req,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { GetRequest } from 'src/dto/GetRequest.dto';
import { CreateTopicDto } from 'src/dto/post/createTopic.dto';
import { TopicResponse } from 'src/dto/post/topicResponse.dto';
import { UpdateTopicDto } from 'src/dto/post/updateTopic.dto';
import { Topic } from 'src/entities/topic/topic.enum';
import { TopicService } from './topic.service';
import { Comment } from 'src/entities/comment/comment.entity';
import { CreateComment } from 'src/dto/comment/createComment.dto';
import { Request } from 'express';
import { UserAuthenticationGuard } from 'src/common/guards/userAuthentication.guard';

@ApiTags('Topic - topic')
@Controller('topic')
@UseGuards(UserAuthenticationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  //   @SetMetadata(METADATA.IS_PUBLIC, true)
  createTopic(
    @Body() model: CreateTopicDto,
    @Req() request: Request,
  ): Promise<boolean> {
    return this.topicService.createTopic(model, (request as any).user);
  }

  @Put()
  updateTopic(
    @Body() model: UpdateTopicDto,
    @Req() request: Request,
  ): Promise<boolean> {
    return this.topicService.editTopic(model, (request as any).user);
  }

  @Delete(':id')
  deleteTopic(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<boolean> {
    return this.topicService.deleteTopic(id, (request as any).user);
  }

  @Get('user')
  getTopicByUserId(
    @Req() request: Request,
    @Query() model: GetRequest,
  ): Promise<[Topic[], number]> {
    return this.topicService.getTopicByUserId(model, (request as any).user);
  }

  @Get('new')
  getNewTopics(@Query() model: GetRequest): Promise<[Topic[], number]> {
    return this.topicService.getNewTopics(model);
  }

  @Get('filter')
  getFilteredTopics(@Query() model: GetRequest): Promise<[Topic[], number]> {
    return this.topicService.getFilteredTopics(model);
  }

  @Get('comments')
  getTopicComments(@Query() model: GetRequest): Promise<[Comment[], number]> {
    return this.topicService.getTopicComments(model);
  }

  @Post('reply/:id')
  replyToTopic(
    @Body() model: CreateComment,
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<boolean> {
    return this.topicService.replyToTopic(model, id, (request as any).user);
  }

  @Put('comment/:id')
  editComment(
    @Body() model: CreateComment,
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<boolean> {
    return this.topicService.editComment(model, id, (request as any).user);
  }

  @Put('like/:id')
  likeTopic(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<boolean> {
    return this.topicService.likeTopic(id, (request as any).user);
  }

  @Put('unlike/:id')
  unlikeTopic(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<boolean> {
    return this.topicService.removeLikedUser(id, (request as any).user);
  }

  @Get(':id')
  getTopicById(@Param('id') id: string): Promise<TopicResponse> {
    console.log('hoplla');
    return this.topicService.getTopicById(id);
  }
}
