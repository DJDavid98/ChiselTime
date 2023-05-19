import { promises as fs } from 'node:fs';
import { serverEnv } from '../server-env';
import { LoggerService } from '@nestjs/common/services/logger.service';
import { randomBytes } from 'node:crypto';
import { dirname } from 'node:path';
import { crypto_secretbox_KEYBYTES } from 'sodium-native';

export const retrieveSessionSecret = async (
  logger: LoggerService,
): Promise<string | Buffer> => {
  const keyFilePath = serverEnv.SESSION_SECRET_KEY_PATH;
  logger.log(`Reading session secret from ${keyFilePath}…`);
  let keyFileContents: Buffer | undefined;
  try {
    keyFileContents = await fs.readFile(keyFilePath);
  } catch (e) {
    if (!(e instanceof Error) || !e.message.includes('ENOENT')) {
      logger.error('Failed to retrieve session secret key file contents');
      throw e;
    }
    // File/folder is missing, attempt to generate it
  }
  if (!keyFileContents) {
    logger.log(`Key file is missing, generating…`);
    const sessionSecretLength = crypto_secretbox_KEYBYTES;
    keyFileContents = randomBytes(sessionSecretLength);
    logger.log(`Generated new session secret of length ${sessionSecretLength}`);
    try {
      const outputFolder = dirname(keyFilePath);
      await fs.mkdir(outputFolder, { recursive: true });
      logger.log(`Recursively created directory structure ${outputFolder}`);
      await fs.writeFile(keyFilePath, keyFileContents);
      logger.log(`Written new new session secret to file ${keyFilePath}`);
    } catch (e) {
      logger.error(
        `Failed to write generated session secret key file contents to ${keyFilePath}`,
      );
      throw e;
    }
  }

  return keyFileContents;
};
