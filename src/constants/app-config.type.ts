export enum Environment {
  Development = 'development',
  Test = 'test',
  Staging = 'staging',
  Production = 'production',
}

export type AppConfig = {
  nodeEnv: Environment;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  corsOrigins: string[];
  port: number;
  version?: string;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
};
