import { HttpStatus, Injectable } from '@nestjs/common';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';
import { customThrowError } from 'src/common/helpers/throw.helper';
import { BaseUserDetailResponse } from 'src/dto/BaseUserDetailResponse.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getUser(id: number): Promise<BaseUserDetailResponse> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      customThrowError(RESPONSE_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const result = new BaseUserDetailResponse(user);
    return result;
  }
}
