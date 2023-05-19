import { MigrationInterface, QueryRunner } from 'typeorm';

export class States1682257504036 implements MigrationInterface {
  name = 'States1682257504036';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "states" (
        "state" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_3027b6249ed4ee187d27cc0638f" PRIMARY KEY ("state"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "states"`);
  }
}
