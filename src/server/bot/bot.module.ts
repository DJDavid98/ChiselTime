import { Module } from '@nestjs/common';
import { SharedModule } from '../shared.module';
import { GatewayIntentBits } from 'discord.js';
import { DiscordModule } from '@discord-nestjs/core';
import { serverEnv } from '../server-env';
import { BotGateway } from './bot.gateway';
import { BotSlashCommandsModule } from '../bot-slash-commands/bot-slash-commands.module';
import { MessageTemplatesModule } from '../message-templates/message-templates.module';

@Module({
  imports: [
    SharedModule,
    DiscordModule.forRootAsync({
      useFactory: () => ({
        token: serverEnv.DISCORD_BOT_TOKEN,
        discordClientOptions: {
          intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
        },
        registerCommandOptions: [
          {
            forGuild: serverEnv.DISCORD_TEST_GUILD_ID || undefined,
            removeCommandsBefore: true,
          },
        ],
      }),
    }),
    MessageTemplatesModule,
    BotSlashCommandsModule,
  ],
  providers: [BotGateway],
})
export class BotModule {}
