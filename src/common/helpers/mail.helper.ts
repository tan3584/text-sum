import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EMAIL_SUBJECT,
  VI_EMAIL_SUBJECT,
} from '../constants/email-subject.enum';
import {
  RESPONSE_MESSAGES,
  RESPONSE_MESSAGES_CODE,
} from '../constants/response-messages.enum';
import { USER_LANGUAGE } from '../constants/user-language.enum';
import { TemplatesService } from '../modules/email-template/template.service';
import { LanguageService } from '../modules/languagues/language.service';
import { customThrowError } from './throw.helper';
import * as handlebars from 'handlebars';
import { MailService } from '@sendgrid/mail';

@Injectable()
export class MailHelper {
  mailService: MailService = new MailService();
  PREFIX_EMAIL_SUBJECT = '';
  from: string;
  to: string;
  frontendHost: string;
  customerFront: string;
  truckOwnerFront: string;
  adminFront: string;
  vi: any;
  en: any;
  MAIL_FOOTER: string;
  host: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly templatesService: TemplatesService,
    private readonly languageService: LanguageService,
  ) {
    this.mailService.setApiKey(this.configService.get('SENDGRID_APIKEY'));
    this.from = this.configService.get('ADMIN_EMAIL');
    this.to = this.configService.get('TO_TEST_EMAIL');
    this.frontendHost = this.configService.get('FRONTEND_HOST');
    this.adminFront = this.configService.get('ADMIN_FRONTEND_HOST');
    this.vi = this.languageService.getResource('vi');
    this.en = this.languageService.getResource('en');
    this.host = this.configService.get('FRONTEND_HOST');
  }

  sendVerifyEmail(
    email: string,
    token: string,
    nickname: string,
    lang: USER_LANGUAGE,
  ): void {
    try {
      let subject;
      if (lang === USER_LANGUAGE.EN) {
        subject = EMAIL_SUBJECT.VERIFY_EMAIL;
      }
      if (lang === USER_LANGUAGE.VI) {
        subject = VI_EMAIL_SUBJECT.VERIFY_EMAIL;
      }
      const templates = this.templatesService.getResource(lang, 'verify.html');
      const data = {
        nickname: nickname,
        hyperlink: this.host + '/account/verify-email/' + token,
      };
      const compileTemplate = handlebars.compile(templates);
      const finalPageHTML = compileTemplate(data);
      this.mailService.send({
        from: this.configService.get('ADMIN_EMAIL'),
        to: email,
        subject: `${subject}`,
        html: finalPageHTML,
      });
    } catch (error) {
      customThrowError(
        RESPONSE_MESSAGES.ERROR,
        HttpStatus.BAD_REQUEST,
        RESPONSE_MESSAGES_CODE.ERROR,
        error,
      );
    }
  }

  sendForgotPassword(
    email: string,
    token: string,
    nickname: string,
    lang: USER_LANGUAGE,
  ): void {
    try {
      let subject;
      if (lang === USER_LANGUAGE.EN) {
        subject = EMAIL_SUBJECT.FORGOT_PASSWORD;
      }
      if (lang === USER_LANGUAGE.VI) {
        subject = VI_EMAIL_SUBJECT.FORGOT_PASSWORD;
      }
      const template = this.templatesService.getResource(
        lang,
        'resetpassword.html',
      );
      const data = {
        nickname: nickname,
        hyperlink: this.host + '/account/reset-password/' + token,
      };
      const compileTemplate = handlebars.compile(template);
      const finalPageHTML = compileTemplate(data);
      this.mailService.send({
        from: this.configService.get('ADMIN_EMAIL'),
        to: email,
        subject: `${this.PREFIX_EMAIL_SUBJECT}${subject}`,
        html: finalPageHTML,
      });
    } catch (error) {
      customThrowError(
        RESPONSE_MESSAGES.ERROR,
        HttpStatus.BAD_REQUEST,
        RESPONSE_MESSAGES_CODE.ERROR,
        error,
      );
    }
  }
}
