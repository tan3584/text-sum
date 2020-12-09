import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { UserModule } from './modules/user/user.module';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { FormatResponseInterceptor } from './common/interceptors/response.interceptor';
import { AuditLogModule } from './common/modules/audit-logs/audit-log.module';
import { AuditLogService } from './common/modules/audit-logs/audit-log.service';
import { LogModule } from './common/modules/custom-logs/log.module';
import { LogService } from './common/modules/custom-logs/log.service';
import { AllExceptionsFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(helmet());

  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT');

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    exposedHeaders: '*',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  app.enableCors(corsOptions);

  const options = new DocumentBuilder()
    .setTitle('Text-sumary APIs')
    .setDescription('Details of text-sum APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [UserModule],
  });
  SwaggerModule.setup('api/swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      skipNullProperties: true,
      skipUndefinedProperties: true,
      skipMissingProperties: true,
      transform: true,
    }),
  );

  const logService = app.select(LogModule).get(LogService);
  const auditLogService = app.select(AuditLogModule).get(AuditLogService);

  const reflector = new Reflector();

  app.useGlobalFilters(new AllExceptionsFilter(logService));

  app.useGlobalInterceptors(
    new FormatResponseInterceptor(),
    new AuditLogInterceptor(reflector, auditLogService),
  );

  await app.listen(port, '0.0.0.0');

  console.log(`api app is working on port: ${port}`);
}
bootstrap();
