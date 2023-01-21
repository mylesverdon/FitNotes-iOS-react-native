import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
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

  @Column("decimal")
  metric_weight: number;

  @Column()
  reps: number;

  @Column({ nullable: true })
  unit?: number;

  @Column({ nullable: true })
  routine_section_exercise_set_id?: number;

  @Column({ nullable: true })
  timer_auto_start?: boolean;

  @Column({ nullable: true })
  is_personal_record?: boolean;

  @Column({ nullable: true })
  is_personal_record_first?: boolean;

  @Column({ nullable: true })
  is_complete?: boolean;

  @Column({ nullable: true })
  is_pending_update?: boolean;

  @Column({ nullable: true })
  distance?: number;

  @Column({ nullable: true })
  duration_seconds?: number;
}
