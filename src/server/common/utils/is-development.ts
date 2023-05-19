import { ConfigService } from '@nestjs/config';

export const isDevelopment = (configService: ConfigService) =>
  configService.get<string>('NODE_ENV') !== 'production';
