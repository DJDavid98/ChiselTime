import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimezoneToMessageTemplate1690645611683
  implements MigrationInterface
{
  name = 'AddTimezoneToMessageTemplate1690645611683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_templates" ADD "timezone" character varying(64)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_templates" DROP COLUMN "timezone"`,
    );
  }
}
