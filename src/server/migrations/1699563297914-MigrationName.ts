// noinspection SqlResolve

import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * This migration removes Patreon integrations from the database
 */
export class MigrationName1699563297914 implements MigrationInterface {
  name = 'MigrationName1699563297914';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_templates" DROP CONSTRAINT "FK_80cb7ff5d9066eb19396f39a13c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_templates" ADD CONSTRAINT "FK_80cb7ff5d9066eb19396f39a13c" FOREIGN KEY ("authorId") REFERENCES "discord_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "patreon_users" DROP CONSTRAINT "FK_0902bd1a912259ce03f04937d53"`,
    );
    await queryRunner.query(`DROP TABLE "patreon_users"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_templates" DROP CONSTRAINT "FK_80cb7ff5d9066eb19396f39a13c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_templates" ADD CONSTRAINT "FK_80cb7ff5d9066eb19396f39a13c" FOREIGN KEY ("authorId") REFERENCES "discord_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`CREATE TABLE "patreon_users" (
      "id" character varying NOT NULL,
      "name" character varying(64) NOT NULL,
      "avatar" character varying(256),
      "accessToken" character varying(256),
      "refreshToken" character varying(256),
      "scopes" character varying(128),
      "tokenExpires" TIMESTAMP WITH TIME ZONE,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "discordUserId" bigint,
      CONSTRAINT "REL_0902bd1a912259ce03f04937d5" UNIQUE ("discordUserId"),
      CONSTRAINT "PK_aec9bfaebedd1cb83891f291eda" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      `ALTER TABLE "patreon_users" ADD CONSTRAINT "FK_0902bd1a912259ce03f04937d53" FOREIGN KEY ("discordUserId") REFERENCES "discord_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
