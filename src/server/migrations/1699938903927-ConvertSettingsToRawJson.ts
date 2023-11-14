import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertSettingsToRawJson1699938903927
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE user_settings SET value = (CONCAT('[', value::text, ']')::json ->> 0)::json`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE user_settings SET value = to_json(value::text)`,
    );
  }
}
