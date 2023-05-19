import { Injectable, Logger } from '@nestjs/common';
import { REST } from '@discordjs/rest';
import { serverEnv } from '../server-env';

@Injectable()
export class DiscordRestService {
  private readonly discordBotRestClient: REST;
  private readonly logger = new Logger(DiscordRestService.name);

  constructor() {
    this.discordBotRestClient = this.clientFactory(serverEnv.DISCORD_BOT_TOKEN);
  }

  get defaultClient() {
    return this.discordBotRestClient;
  }

  public clientFactory(token: string): REST {
    this.logger.debug(`Creating Discord API REST client…`);
    return new REST({
      version: '10',
      userAgentAppendix: serverEnv.UA_STRING,
    }).setToken(token);
  }
}
