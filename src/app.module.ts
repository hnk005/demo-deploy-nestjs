import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import appConfig from './config/app.config.js';
import { AllConfigType } from './constants/config.type.js';
import { Environment } from './constants/app-config.type.js';

export const IS_PRODUCTION = 'IS_PRODUCTION';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: IS_PRODUCTION,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) =>
        configService.getOrThrow('app.nodeEnv', { infer: true }) ===
        Environment.Production,
    },
  ],
  exports: [IS_PRODUCTION],
})
export class AppModule {}
