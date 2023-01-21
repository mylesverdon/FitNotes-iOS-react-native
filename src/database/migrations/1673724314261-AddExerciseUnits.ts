import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddExerciseUnits1673724314261 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const col = new TableColumn({
      name: "unit_metric",
      type: "boolean",
      default: true,
    });
    await queryRunner.addColumn("exercise", col);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("exercise", "unit_metric");
  }
}
