import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailHelper } from 'src/common/helpers/mail.helper';
import { PasswordHelper } from 'src/common/helpers/password.helper';
import { TokenHelper } from 'src/common/helpers/token.helper';
import { TemplatesService } from 'src/common/modules/email-template/template.service';
import { LanguageService } from 'src/common/modules/languagues/language.service';
import { Comment } from 'src/entities/comment/comment.entity';
import { NotificationInstance } from 'src/entities/notification-instance/notification-instance.entity';
import { Notification } from 'src/entities/notification/notification.entity';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { TopicController } from './topic.controller';
import { TopicRepository } from './topic.repository';
import { TopicService } from './topic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TopicRepository,
      Notification,
      NotificationInstance,
      Comment,
    ]),
  ],
  controllers: [TopicController],
  providers: [
    UserService,
    TokenHelper,
    MailHelper,
    TemplatesService,
    LanguageService,
    UserRepository,
    PasswordHelper,
    TopicService,
  ],
})
export class TopicModule {}
