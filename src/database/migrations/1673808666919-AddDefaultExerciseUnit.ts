import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class AddDefaultExerciseUnit1673808666919 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const col = new TableColumn({
      name: "default_unit",
      type: "boolean",
      default: true,
      isNullable: false,
    });
    await queryRunner.addColumn("exercise", col);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("exercise", "default_unit");
  }
}
