import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessageTemplates1683837516803 implements MigrationInterface {
  name = 'MessageTemplates1683837516803';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "message_template" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "channelId" bigint NOT NULL,
        "messageId" bigint NOT NULL,
        "body" text NOT NULL,
        "updateFrequency" character varying(16) NOT NULL,
        "lastEditedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "authorId" bigint,
        CONSTRAINT "PK_616800da109c721fb4dd2019a9b" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      `ALTER TABLE "message_template" ADD CONSTRAINT "FK_93b9e498cfe962fda1594358bc4" FOREIGN KEY ("authorId") REFERENCES "discord_users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_template" DROP CONSTRAINT "FK_93b9e498cfe962fda1594358bc4"`,
    );
    await queryRunner.query(`DROP TABLE "message_template"`);
  }
}
