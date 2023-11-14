// noinspection SqlResolve

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestampsToUserSettings1699940949954
  implements MigrationInterface
{
  name = 'AddTimestampsToUserSettings1699940949954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_settings"
      ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user_settings"
      ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_settings"
      DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "user_settings"
      DROP COLUMN "created_at"`);
  }
}
