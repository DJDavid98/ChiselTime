import { Module } from '@nestjs/common';
import { StatisticsCommand } from './commands/statistics.command';
import { CreateTemplateCommand } from './commands/create-template.command';
import { SharedModule } from '../shared.module';
import { DeleteTemplateCommand } from './commands/delete-template.command';

@Module({
  imports: [SharedModule],
  providers: [StatisticsCommand, CreateTemplateCommand, DeleteTemplateCommand],
})
export class BotSlashCommandsModule {}
