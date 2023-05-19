import { join } from 'path';
import { ShardingManager } from 'discord.js';
import { bootstrap } from './main';
import { serverEnv } from './server-env';
import { Logger } from 'nestjs-pino';

(async () => {
  const app = await bootstrap();
  const logger = app.get(Logger);

  const botScriptPath = join(__dirname, 'bot', 'index.js');

  logger.log(
    `Starting recommended number of shards with path ${botScriptPath}`,
  );
  const manager = new ShardingManager(botScriptPath, {
    token: serverEnv.DISCORD_BOT_TOKEN,
  });

  manager.spawn();
  manager.on('shardCreate', (shard) => {
    logger.log(`Shard ${shard.id} created`);

    shard.on('spawn', () => {
      logger.log(`Shard ${shard.id} spawned`);
    });
    shard.on('ready', () => {
      logger.log(`Shard ${shard.id} ready`);
    });
    shard.on('disconnect', () => {
      logger.log(`Shard ${shard.id} disconnected`);
    });
    shard.on('reconnecting', () => {
      logger.log(`Shard ${shard.id} reconnecting`);
    });
    shard.on('death', () => {
      logger.warn(`Shard ${shard.id} died`);
      if (serverEnv.LOCAL) {
        logger.error(
          'Because application is running in local mode, it will now shut down',
        );
        process.exit(1);
      }
    });
  });
})();
