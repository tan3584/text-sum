import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationInstance } from 'src/entities/notification-instance/notification-instance.entity';
import { UserRepository } from 'src/modules/user/user.repository';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, NotificationInstance])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
