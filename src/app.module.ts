import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user/user.entity';
import { UserModule } from './modules/user/user.module';
import { Notification } from './entities/notification/notification.entity';
import { NotificationInstance } from './entities/notification-instance/notification-instance.entity';
import { File } from './entities/file/file.entity';
import { TemplatesService } from './common/modules/email-template/template.service';
import { LanguageService } from './common/modules/languagues/language.service';
import { MailHelper } from './common/helpers/mail.helper';
import { TokenHelper } from './common/helpers/token.helper';
import { PasswordHelper } from './common/helpers/password.helper';
import { AuditLogModule } from './common/modules/audit-logs/audit-log.module';
import { LanguageModule } from './common/modules/languagues/language.module';
import { LogModule } from './common/modules/custom-logs/log.module';
import { NotificationModule } from './common/notification/notification.module';
import { Log } from './entities/log/log.entity';
import { AuditLog } from './entities/audit-log/audit-log.entity';
import { Topic } from './entities/topic/topic.enum';
import { Comment } from './entities/comment/comment.entity';

const env = process.env.NODE_ENV || 'development';

const envFilePath =
  env === 'development' ? '.env' : `.env${process.env.NODE_ENV}`;

const entities = [
  User,
  Notification,
  NotificationInstance,
  File,
  Log,
  Notification,
  NotificationInstance,
  AuditLog,
  Topic,
  Comment,
];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_ROOT_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: entities,
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    LanguageModule,
    LogModule,
    PasswordHelper,
    TokenHelper,
    AuditLogModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TemplatesService,
    LanguageService,
    MailHelper,
    TokenHelper,
  ],
})
export class AppModule {
  /*
    apply middleware latter
  */
}
