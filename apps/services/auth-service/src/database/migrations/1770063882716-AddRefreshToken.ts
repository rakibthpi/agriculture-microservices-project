import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshToken1770063882716 implements MigrationInterface {
  name = 'AddRefreshToken1770063882716';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "refresh_token_hash" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token_hash"`);
  }
}
