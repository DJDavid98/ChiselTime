import { Module } from '@nestjs/common';
import { SharedModule } from '../shared.module';
import { GatewayIntentBits } from 'discord.js';
import { DiscordModule } from '@discord-nestjs/core';
import { serverEnv } from '../server-env';
import { BotGateway } from './bot.gateway';
import { BotSlashCommandsModule } from '../bot-slash-commands/bot-slash-commands.module';

@Module({
  imports: [
    SharedModule,
    // TODO Replace with https://necord.org/
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
    BotSlashCommandsModule,
  ],
  providers: [BotGateway],
})
export class BotModule {}
