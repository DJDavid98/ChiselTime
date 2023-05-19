import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ViewModule } from './view/view.module';
import { StateModule } from './state/state.module';
import { SharedModule } from './shared.module';

@Module({
  imports: [SharedModule, ViewModule, StateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
