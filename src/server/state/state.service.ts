import { Injectable, Logger } from '@nestjs/common';
import { getRandomUuid } from '../utils/random';
import { DataSource, EntityManager } from 'typeorm';
import { State } from './entities/state.entity';
import {
  Metadata,
  StateStore,
  StateStoreStoreCallback,
  StateStoreVerifyCallback,
} from 'passport-oauth2';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * Generate and consume OAuth state parameters for CSRF protection purposes
 */
@Injectable()
export class StateService implements StateStore {
  private readonly logger = new Logger(StateService.name);

  public static STALE_TIME_MS = 3600e3;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly dataSource: DataSource,
  ) {}

  store(req: unknown, callback: StateStoreStoreCallback): void;
  store(req: unknown, Metadata: any, callback: StateStoreStoreCallback): void;
  store(
    req: unknown,
    metaOrCallback: StateStoreStoreCallback | Metadata,
    callback?: StateStoreStoreCallback,
  ): Promise<string> {
    const promise = this.storeAsync();
    const callbackFn = this.findCallback<StateStoreStoreCallback>(
      metaOrCallback,
      callback,
    );
    promise.then(
      (state) => callbackFn(null as unknown as Error, state),
      (err) => callbackFn(err, null),
    );
    return promise;
  }

  verify(req: any, state: string, callback: StateStoreVerifyCallback): void;
  verify(
    req: unknown,
    state: string,
    meta: Metadata,
    callback: StateStoreVerifyCallback,
  ): void;
  verify(
    req: unknown,
    state: string,
    metaOrCallback: StateStoreVerifyCallback | Metadata,
    callback?: StateStoreVerifyCallback,
  ): Promise<boolean> {
    const promise = this.verifyAsync(state);
    const callbackFn = this.findCallback<StateStoreVerifyCallback>(
      metaOrCallback,
      callback,
    );
    promise.then(
      (ok) => callbackFn(null as unknown as Error, ok, state),
      (err) => callbackFn(err, false, state),
    );
    return promise;
  }

  /**
   * Creates  a new state value, persists it in the database, then returns it
   */
  private async storeAsync(): Promise<string> {
    const state = getRandomUuid();
    this.logger.debug(`Generated state: ${state}, saving…`);
    const entity = new State();
    entity.state = state;
    await this.entityManager.save(entity);
    this.logger.debug(`State ${state} saved`);
    return entity.state;
  }

  /**
   * Validates the provided state value by trying to delete it from the database and checking the affected rows
   * @returns boolean indicating whether the deletion was successful
   */
  private async verifyAsync(state: string): Promise<boolean> {
    this.logger.debug(`Validating state: ${state}…`);
    const result = await this.entityManager.delete(State, { state });
    const valid = typeof result.affected === 'number' && result.affected > 0;
    this.logger.debug(`State ${state} validation result: ${valid}`);
    return valid;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private findCallback<F extends Function>(...callbacks: unknown[]): F {
    const callbackFn: F | undefined = callbacks.find(
      (v): v is F => typeof v === 'function',
    );
    if (!callbackFn) {
      throw new Error('Could not find callback parameter');
    }
    return callbackFn;
  }

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'stateCleanup',
  })
  async cleanupOldStateValues() {
    this.logger.log('Cleaning up stale state values…');
    const result = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('states')
      .where(
        `createdAt + INTERVAL '${Math.round(
          StateService.STALE_TIME_MS / 1e3,
        )} SECOND' < NOW()`,
      )
      .execute();
    const rowCount = typeof result.affected === 'number' ? result.affected : 0;
    this.logger.log(`Cleaned up ${rowCount} stale state values`);
  }
}
