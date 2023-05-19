export const messageUpdatesQueueName = 'messageUpdate';

export interface MessageUpdatesQueueData {
  id: string;
}

export const messageUpdatesStartupHandlerDelay = 5e3;

export const messageUpdatesInterval = 60e3;

export const messageUpdatesConcurrency = 5;
