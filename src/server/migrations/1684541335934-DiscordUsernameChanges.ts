import { MigrationInterface, QueryRunner } from 'typeorm';

export class DiscordUsernameChanges1684541335934 implements MigrationInterface {
  name = 'DiscordUsernameChanges1684541335934';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_templates" DROP CONSTRAINT "FK_93b9e498cfe962fda1594358bc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discord_users" ADD "displayName" character varying(32)`,
    );
    await queryRunner.query(
      `ALTER TABLE "discord_users" ALTER COLUMN "discriminator" TYPE smallint USING "discriminator"::smallint`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_templates" ADD CONSTRAINT "FK_80cb7ff5d9066eb19396f39a13c" FOREIGN KEY ("authorId") REFERENCES "discord_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_templates" DROP CONSTRAINT "FK_80cb7ff5d9066eb19396f39a13c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discord_users" ALTER COLUMN "discriminator" TYPE character(4) USING substring(('0000' || "discriminator") from '\\d{4}$')`,
    );
    await queryRunner.query(
      `ALTER TABLE "discord_users" DROP COLUMN "displayName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_templates" ADD CONSTRAINT "FK_93b9e498cfe962fda1594358bc4" FOREIGN KEY ("authorId") REFERENCES "discord_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
