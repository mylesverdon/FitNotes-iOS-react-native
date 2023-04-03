import { MigrationInterface, QueryRunner } from "typeorm"

export class InitialMigration1674319002290 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
