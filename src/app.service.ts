import { Injectable } from '@nestjs/common';
import { MailHelper } from './common/helpers/mail.helper';

@Injectable()
export class AppService {
  constructor(private readonly mailHelper: MailHelper) {}
  getHello(): string {
    return 'Hello World!';
  }
}
