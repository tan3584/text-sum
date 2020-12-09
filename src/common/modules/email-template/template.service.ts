import { HttpStatus, Injectable } from '@nestjs/common';
import fs = require('fs');
import path = require('path');
import { customThrowError } from 'src/common/helpers/throw.helper';
// import * as handlebars from 'handlebars';

@Injectable()
export class TemplatesService {
  getResource(lang: string, template: string): any {
    const pathDir = path.join(__dirname, '../../../templates');
    if (!fs.existsSync(`${pathDir}/user/${lang}/${template}`)) {
      customThrowError('Resource not found!', HttpStatus.NOT_FOUND);
    }
    // const footer = fs
    //   .readFileSync(`${pathDir}/user/${lang}/footer.html`, 'utf8')
    //   .toString();
    // const data = footer.replace('{{footer}}', this.MAIL_FOOTER);
    // handlebars.registerPartial('footer', data);
    const templates = fs
      .readFileSync(`${pathDir}/user/${lang}/${template}`)
      .toString();
    return templates;
  }
}
