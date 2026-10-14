import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';

import { AppModule } from './app.module.js';
import { AllConfigType } from './constants/config.type.js';
import validationOptions from './common/validation/validation-options.js';
import { ProblemDetailsFilter } from './filter/problem-details.filter.js';
import { setupSwagger } from './setup-swagger.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService<AllConfigType>);
  const isProduction =
    configService.getOrThrow('app.nodeEnv', { infer: true }) === 'production';
  const corsOrigins = configService.getOrThrow('app.corsOrigins', {
    infer: true,
  });
  const port = configService.getOrThrow('app.port', { infer: true });
  const serverUrl = configService.getOrThrow('app.backendDomain', {
    infer: true,
  });
  const logger = new Logger('Bootstrap');

  app.use(
    helmet({
      contentSecurityPolicy: isProduction,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.enableCors({
    origin: corsOrigins.includes('*') ? '*' : corsOrigins,
  });

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  app.useGlobalFilters(new ProblemDetailsFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  setupSwagger(app, configService);

  await app.listen(port, () =>
    logger.log(`Application is running on: ${serverUrl}`),
  );
}

void bootstrap();
