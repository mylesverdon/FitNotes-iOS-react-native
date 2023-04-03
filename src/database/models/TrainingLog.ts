import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exercise } from "./Exercise";

@Entity("training_log")
export class TrainingLog {
  constructor(
    exercise: Exercise,
    date: string,
    metricWeight: number,
    reps: number
  ) {
    this.exercise = exercise;
    this.date = date;
    this.metric_weight = metricWeight;
    this.reps = reps;
  }

  @PrimaryGeneratedColumn("increment")
  _id: number;

  @ManyToOne(() => Exercise, (exercise) => exercise.trainingLogs, {
    eager: true,
    cascade: false,
  })
  exercise: Exercise;

  @Column()
  date: string;

  // Metrics
  @Column("decimal", { nullable: true })
  metric_weight: number;
  @Column({ nullable: true })
  reps: number;
  @Column({ nullable: true })
  distance?: number;
  @Column({ nullable: true })
  duration_seconds?: number;

  @Column({ nullable: true })
  is_personal_record?: boolean;

  @Column({ nullable: true })
  is_complete?: boolean;
}
