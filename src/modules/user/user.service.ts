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
import { SetPassword } from 'src/dto/user/SetPassword.dto';
import { ResetPassword } from 'src/dto/user/ResetPassword.dto';
import { ChangePassword } from 'src/dto/user/ChangePassword.dto';
import { getNickname } from 'src/common/helpers/utility.helper';
import { MailHelper } from 'src/common/helpers/mail.helper';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHelper: PasswordHelper,
    private readonly tokenHelper: TokenHelper,
    private readonly mailHelper: MailHelper,
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
      const tokenData = {
        id: result.id,
        role: TOKEN_ROLE.USER,
        type: TOKEN_TYPE.VERIFY,
      };
      const verifyToken = this.tokenHelper.createToken(tokenData);
      // await this.mailHelper.sendWelcomeMail(
      //   result.email,
      //   TOKEN_ROLE.USER,
      //   getNickname(result),
      //   result.preferLanguage,
      // );
      this.mailHelper.sendVerifyEmail(
        result.email,
        verifyToken,
        getNickname(result),
        result.preferLanguage,
      );
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
    console.log('user');
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

  async changePassword(id: number, model: ChangePassword): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000) * 1000;
    const user = await this.userRepository.findOne(
      { id },
      {
        select: ['id', 'password', 'passwordChangedAt', 'email', 'firstName'],
      },
    );
    if (!user) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND,
      );
    }

    const newHash = await this.passwordHelper.createHash(model.password);

    user.password = newHash;
    user.passwordChangedAt = new Date(now);

    await this.userRepository.save(user);

    // this.mailHelper.sendPasswordChangedEmail(user.email, user.firstName);

    return true;
  }

  async forgotPassword(email: string, lang: USER_LANGUAGE): Promise<boolean> {
    const user = await this.userRepository.findOne(
      { email: email.toLowerCase() },
      {
        select: ['id', 'email', 'firstName'],
      },
    );
    if (!user) {
      customThrowError(
        RESPONSE_MESSAGES.EMAIL_NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.EMAIL_NOT_FOUND,
      );
    }
    const token = this.tokenHelper.createToken({
      id: user.id,
      email: user.email.toLowerCase(),
      type: TOKEN_TYPE.FORGOT_PASSWORD,
    });
    this.mailHelper.sendForgotPassword(
      token,
      user.email.toLowerCase(),
      getNickname(user),
      lang,
    );

    return true;
  }

  async resetPassword(model: ResetPassword): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000) * 1000;
    const data = this.tokenHelper.verifyToken(
      model.token,
      TOKEN_TYPE.FORGOT_PASSWORD,
    );
    const user = await this.userRepository.findOne(
      {
        email: data.email,
        id: data.id,
      },
      { select: ['id'] },
    );

    if (!user) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND,
      );
    }

    user.password = await this.passwordHelper.createHash(model.password);
    user.passwordChangedAt = new Date(now);

    await this.userRepository.save(user);
    return true;
  }

  async setPassword(model: SetPassword): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000) * 1000;
    const data = this.tokenHelper.verifyToken(
      model.token,
      TOKEN_TYPE.SET_PASSWORD,
    );
    const user = await this.userRepository.findOne(
      {
        email: data.email,
        id: data.id,
      },
      { select: ['id'] },
    );

    if (!user) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND,
      );
    }

    user.password = await this.passwordHelper.createHash(model.password);
    user.passwordChangedAt = new Date(now);
    user.emailVerified = true;

    await this.userRepository.save(user);

    return true;
  }

  async verifyToken(token: string): Promise<BaseUserDetailResponse> {
    const data = this.tokenHelper.verifyToken(token);

    const user = await this.userRepository.findOne({
      email: data.email,
    });

    if (!user) {
      customThrowError(
        RESPONSE_MESSAGES.ERROR,
        HttpStatus.UNAUTHORIZED,
        RESPONSE_MESSAGES_CODE.ERROR,
      );
    }
    const result = new BaseUserDetailResponse({
      ...user,
      token,
    });

    return result;
  }

  async verifyResetToken(token: string): Promise<BaseUserDetailResponse> {
    const data = this.tokenHelper.verifyToken(
      token,
      TOKEN_TYPE.FORGOT_PASSWORD,
    );

    const result = new BaseUserDetailResponse({
      ...data,
      token,
    });

    return result;
  }

  async changeLanguage(
    language: USER_LANGUAGE,
    token: string,
    tokenData: Record<string, any>,
  ): Promise<boolean> {
    const { id } = tokenData;
    let repository: Repository<User>;
    const user = await repository.findOne(id, {
      select: ['id', 'preferLanguage'],
    });
    if (!user) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND,
      );
    }
    user.preferLanguage = language;
    await repository.save(user);
    return true;
  }
}
