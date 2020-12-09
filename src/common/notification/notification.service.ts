import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';
import { TOKEN_ROLE } from 'src/common/constants/token-role.enum';
import { PaginationRequest } from 'src/common/dtos/pagination.dto';
import { customThrowError } from 'src/common/helpers/throw.helper';
import { NotificationInstance } from 'src/entities/notification-instance/notification-instance.entity';
import { User } from 'src/entities/user/user.entity';
import { UserRepository } from 'src/modules/user/user.repository';
import { Repository } from 'typeorm';
import { TOKEN_PLATFORM } from './dto/register-token.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(NotificationInstance)
    private readonly notificationInstanceRepository: Repository<
      NotificationInstance
    >,
  ) {}

  async registerToken(
    token: string,
    tokenData: Record<string, any>,
    platform: TOKEN_PLATFORM,
  ): Promise<boolean> {
    const { role, id } = tokenData;
    if (role === null || role === undefined) {
      customThrowError(RESPONSE_MESSAGES.TOKEN_ERROR, HttpStatus.NOT_FOUND);
    }

    let repository: Repository<User>;

    switch (role) {
      // case TOKEN_ROLE.ADMIN:
      //   repository = this.adminRepository;
      //   break;
      case TOKEN_ROLE.USER:
        repository = this.userRepository;
        break;
    }

    if (!repository) {
      customThrowError(RESPONSE_MESSAGES.TOKEN_ERROR, HttpStatus.NOT_FOUND);
    }

    const user = await repository.findOne({
      where: {
        id,
      },
      select: ['id'],
    });

    if (!user) {
      customThrowError(RESPONSE_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (platform === TOKEN_PLATFORM.WEB) {
      user.notiToken = token;
    } else {
      user.deviceToken = token;
    }
    await repository.save(user);
    return true;
  }

  async listInstance(
    token: Record<string, any>,
    filter: PaginationRequest,
  ): Promise<[NotificationInstance[], number, number]> {
    if (!token) {
      return [[], 0, 0];
    }

    const { skip, take } = filter;
    const where = {
      referenceId: token.id,
      referenceType: token.role,
    };
    const [noti, unreadCount] = await Promise.all([
      this.notificationInstanceRepository.findAndCount({
        where,
        skip,
        take,
        relations: ['notification'],
        order: {
          createdDate: 'DESC',
        },
      }),
      this.notificationInstanceRepository.count({
        where: {
          ...where,
          isRead: false,
        },
      }),
    ]);
    return [...noti, unreadCount];
  }

  async readNoti(id: number, token: Record<string, any>): Promise<boolean> {
    if (!token) {
      customThrowError(RESPONSE_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const where = {
      referenceId: token.id,
      referenceType: token.role,
      id,
    };
    const noti = await this.notificationInstanceRepository.findOne({
      where,
      select: ['id'],
    });
    if (!noti) {
      customThrowError(RESPONSE_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    noti.isRead = true;
    await this.notificationInstanceRepository.save(noti);
    return true;
  }
}
