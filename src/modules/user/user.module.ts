import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordHelper } from 'src/common/helpers/password.helper';
import { TokenHelper } from 'src/common/helpers/token.helper';
import { NotificationInstance } from 'src/entities/notification-instance/notification-instance.entity';
import { Notification } from 'src/entities/notification/notification.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      Notification,
      NotificationInstance,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, PasswordHelper, TokenHelper],
})
export class UserModule {}
