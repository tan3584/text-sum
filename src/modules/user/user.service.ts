import { HttpStatus, Injectable } from '@nestjs/common';
import {
  RESPONSE_MESSAGES,
  RESPONSE_MESSAGES_CODE,
} from 'src/common/constants/response-messages.enum';
import { USER_LANGUAGE } from 'src/common/constants/user-language.enum';
import { customThrowError } from 'src/common/helpers/throw.helper';
import { BaseUserDetailResponse } from 'src/dto/BaseUserDetailResponse.dto';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { UserRepository } from './user.repository';
import { PasswordHelper } from 'src/common/helpers/password.helper';
import { User } from 'src/entities/user/user.entity';
import { TokenHelper } from 'src/common/helpers/token.helper';
import { LoginUserDto } from 'src/dto/user/LoginUser.dto';
import { TOKEN_ROLE } from 'src/common/constants/token-role.enum';
import { TOKEN_TYPE } from 'src/common/constants/token-types.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHelper: PasswordHelper,
    private readonly tokenHelper: TokenHelper,
  ) {}
  async getUser(id: number): Promise<BaseUserDetailResponse> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      customThrowError(RESPONSE_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const result = new BaseUserDetailResponse(user);
    return result;
  }

  async registerAccount(
    model: CreateUserDto,
    lang: USER_LANGUAGE,
  ): Promise<boolean> {
    const where = [];
    where.push({
      email: model.email,
    });
    const existed = await this.userRepository.findOne({ where: where });
    if (existed) {
      customThrowError(
        RESPONSE_MESSAGES.EMAIL_EXIST,
        HttpStatus.BAD_REQUEST,
        RESPONSE_MESSAGES_CODE.EMAIL_EXIST,
      );
    }
    await this._createUser(model, lang);
    return true;
  }

  private async _createUser(model: CreateUserDto, lang: USER_LANGUAGE) {
    try {
      let hash = '';
      if (model.password) {
        hash = await this.passwordHelper.createHash(model.password);
      }

      const user = new User();
      user.email = model.email;
      user.password = hash;
      if (model.phoneNumber) {
        user.phoneNumber = model.phoneNumber;
      }
      user.preferLanguage = lang;

      const result = await this.userRepository.save(user);
      return result;
    } catch (error) {
      customThrowError(
        RESPONSE_MESSAGES.CREATE_ERROR,
        HttpStatus.BAD_REQUEST,
        RESPONSE_MESSAGES_CODE.CREATE_ERROR,
        error,
      );
    }
  }

  async login(model: LoginUserDto): Promise<BaseUserDetailResponse> {
    const user = await this.userRepository.getLoginUserWithOptions({
      email: model.email,
    });
    if (!user) {
      customThrowError(
        RESPONSE_MESSAGES.LOGIN_FAIL,
        HttpStatus.UNAUTHORIZED,
        RESPONSE_MESSAGES_CODE.LOGIN_FAIL,
      );
    }

    if (user.deletedAt) {
      customThrowError(
        RESPONSE_MESSAGES.DELETED_ACCOUNT,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.DELETED_ACCOUNT,
      );
    }

    // if (!user.emailVerified) {
    //   customThrowError(
    //     RESPONSE_MESSAGES.EMAIL_NOT_VERIFY,
    //     HttpStatus.UNAUTHORIZED,
    //     RESPONSE_MESSAGES_CODE.EMAIL_NOT_VERIFY,
    //   );
    // }
    await this._checkPassword(model.password, user.password);

    const token = this.tokenHelper.createToken({
      id: user.id,
      email: user.email,
      type: TOKEN_TYPE.USER_LOGIN,
      role: TOKEN_ROLE.USER,
    });

    const result: BaseUserDetailResponse = new BaseUserDetailResponse({
      token,
      ...user,
    });
    return result;
  }

  private async _checkPassword(plain, hash) {
    const matched = await this.passwordHelper.checkHash(plain, hash);

    if (!matched) {
      customThrowError(
        RESPONSE_MESSAGES.LOGIN_FAIL,
        HttpStatus.UNAUTHORIZED,
        RESPONSE_MESSAGES_CODE.LOGIN_FAIL,
      );
    }
    return true;
  }
}
