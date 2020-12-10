import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailHelper } from 'src/common/helpers/mail.helper';
import { TokenHelper } from 'src/common/helpers/token.helper';
import { TemplatesService } from 'src/common/modules/email-template/template.service';
import { LanguageService } from 'src/common/modules/languagues/language.service';
import { NotificationInstance } from 'src/entities/notification-instance/notification-instance.entity';
import { Notification } from 'src/entities/notification/notification.entity';
import { UserService } from '../user/user.service';
import { TopicController } from './topic.controller';
import { TopicRepository } from './topic.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TopicRepository,
      Notification,
      NotificationInstance,
    ]),
  ],
  controllers: [TopicController],
  providers: [
    UserService,
    TokenHelper,
    MailHelper,
    TemplatesService,
    LanguageService,
  ],
})
export class TopicModule {}
