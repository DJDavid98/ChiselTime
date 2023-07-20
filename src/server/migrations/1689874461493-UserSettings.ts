import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserSettings1689874461493 implements MigrationInterface {
  name = 'UserSettings1689874461493';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user_settings" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "setting" character varying(64) NOT NULL,
      "value" json NOT NULL,
      "userId" bigint NOT NULL,
      CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD CONSTRAINT "FK_986a2b6d3c05eb4091bb8066f78" FOREIGN KEY ("userId") REFERENCES "discord_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_settings"`);
  }
}
