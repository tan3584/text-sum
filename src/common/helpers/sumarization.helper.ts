import { HttpServer, HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SumHelper {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
    ) {}

  sumarization = async (data: string): Promise<any> =>  {
    const sumApi = process.env.TEXT_SUM_API; 
    const result = await this.httpService.post(`${sumApi}/sumarization`, data).toPromise();
  return result;
  }
}
