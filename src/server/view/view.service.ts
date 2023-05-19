import { Injectable, OnModuleInit } from '@nestjs/common';
import createServer from 'next';
import { NextServer } from 'next/dist/server/next';
import { serverEnv } from '../server-env';

@Injectable()
export class ViewService implements OnModuleInit {
  private server: NextServer;

  async onModuleInit(): Promise<void> {
    if (this.server) {
      return;
    }
    try {
      this.server = createServer({
        dev: serverEnv.LOCAL,
        dir: './src/client',
      });
      await this.server.prepare();
    } catch (error) {
      console.error(error);
    }
  }

  get handler() {
    return this.server.getRequestHandler();
  }
}
