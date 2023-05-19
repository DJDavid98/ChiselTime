import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameMessageTemplatesTable1683908654873
  implements MigrationInterface
{
  name = 'RenameMessageTemplatesTable1683908654873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_template" RENAME TO "message_templates"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_templates" RENAME TO "message_template"`,
    );
  }
}
