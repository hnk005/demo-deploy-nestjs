import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

import { validateConfig } from '@/common/utils.js';
import { AppConfig, Environment } from '@/constants/app-config.type.js';
import { Type } from 'class-transformer';

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsString()
  @IsOptional()
  APP_NAME: string;

  @IsString()
  @IsOptional()
  PWD: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsString()
  @IsOptional()
  API_VERSION: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  APP_CORS_ORIGINS: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;
}

export default registerAs<AppConfig>('app', () => {
  const env = validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: env.NODE_ENV || Environment.Development,
    name: env.APP_NAME || 'app',
    workingDirectory: env.PWD || process.cwd(),
    frontendDomain: env.FRONTEND_DOMAIN,
    backendDomain: env.BACKEND_DOMAIN ?? 'http://localhost',
    corsOrigins: (env.APP_CORS_ORIGINS || env.FRONTEND_DOMAIN || '*')
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0),
    port: env.APP_PORT ?? 3000,
    version: env.API_VERSION,
    apiPrefix: env.API_PREFIX || 'api',
    fallbackLanguage: env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: env.APP_HEADER_LANGUAGE || 'x-custom-lang',
  };
});
