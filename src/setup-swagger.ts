import { Logger, type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllConfigType } from './constants/config.type.js';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService<AllConfigType>,
): void {
  const docName: string = `${configService.getOrThrow('app.name', { infer: true })} APIs Specification`;
  const docDesc: string = 'Section for describe whole APIs';
  const docVersion: string | undefined = configService.get('app.version', {
    infer: true,
  });
  const docPrefix: string = '/docs';
  const docServerUrl: string = configService.getOrThrow('app.backendDomain', {
    infer: true,
  });
  const logger = new Logger('Swagger');

  const documentBuilder = new DocumentBuilder()
    .setTitle(docName)
    .setDescription(docDesc)
    .addServer('/')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'xApiKey');

  if (docVersion) {
    documentBuilder.setVersion(docVersion);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup(docPrefix, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  logger.log(`Documentation: ${docServerUrl}${docPrefix}`);
}
