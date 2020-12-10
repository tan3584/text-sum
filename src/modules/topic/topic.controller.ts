import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { CreateTopicDto } from 'src/dto/post/createTopic.dto';
import { TopicService } from './topic.service';

@ApiTags('Topic')
@Controller('topic')
// @UseGuards()
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
}
