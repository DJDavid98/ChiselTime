import { Module } from '@nestjs/common';

import { ViewController } from './view.controller';
import { ViewService } from './view.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [ViewService, ConfigService],
  controllers: [ViewController],
})
export class ViewModule {}
