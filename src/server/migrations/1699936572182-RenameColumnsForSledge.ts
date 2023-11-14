import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameColumnsForSledge1699936572182 implements MigrationInterface {
  protected RENAMED_COLUMNS = {
    discord_users: {
      userId: 'user_id',
      displayName: 'display_name',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      tokenExpires: 'token_expires',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    user_settings: {
      userId: 'discord_user_id',
    },
    users: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  } as const;

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const tableName of Object.keys(this.RENAMED_COLUMNS)) {
      for (const [oldName, newName] of Object.entries(
        this.RENAMED_COLUMNS[tableName as keyof typeof this.RENAMED_COLUMNS],
      )) {
        await queryRunner.renameColumn(tableName, oldName, newName);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const tableName of Object.keys(this.RENAMED_COLUMNS)) {
      for (const [oldName, newName] of Object.entries(
        this.RENAMED_COLUMNS[tableName as keyof typeof this.RENAMED_COLUMNS],
      )) {
        await queryRunner.renameColumn(tableName, newName, oldName);
      }
    }
  }
}
