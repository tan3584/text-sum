/* eslint-disable quotes */
import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SumHelper {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  sumarization = async (content: string): Promise<any> => {
    const sumApi = process.env.TEXT_SUM_API;
    const data = {
      text: content,
    };
    return await this.httpService.post(`${sumApi}/summarize`, data).toPromise();
  };
}
