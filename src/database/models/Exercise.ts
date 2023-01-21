import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { TrainingLog } from "./TrainingLog";

@Entity("exercise")
export class Exercise {
  constructor(name: string, category: Category) {
    this.name = name;
    this.category = category;
  }

  @PrimaryGeneratedColumn("increment")
  _id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.exercises, {
    eager: true,
    cascade: false,
  })
  category: Category;

  @Column({ default: 0 })
  exercise_type_id: number;

  @Column({ nullable: true, default: false })
  default_unit: boolean;

  @Column({ nullable: true, default: true })
  unit_metric: boolean;

  @Column({ nullable: true })
  notes: string;

  @Column("decimal")
  weight_increment: number;

  @Column({ nullable: true })
  default_graph_id: number;

  @Column({ nullable: true })
  default_rest_time: number;

  @OneToMany(() => TrainingLog, (trainingLog) => trainingLog.exercise)
  trainingLogs: TrainingLog[];
}

export const defaults = [
  { name: "Overhead Press", category_name: "Shoulders" },
  { name: "Seated Dumbbell Press", category_name: "Shoulders" },
  { name: "Lateral Dumbbell Raise", category_name: "Shoulders" },
  { name: "Front Dumbbell Raise", category_name: "Shoulders" },
  { name: "Push Press", category_name: "Shoulders" },
  { name: "Behind The Neck Barbell Press", category_name: "Shoulders" },
  { name: "Hammer Strength Shoulder Press", category_name: "Shoulders" },
  { name: "Seated Dumbbell Lateral Raise", category_name: "Shoulders" },
  { name: "Lateral Machine Raise", category_name: "Shoulders" },
  { name: "Rear Delt Dumbbell Raise", category_name: "Shoulders" },
  { name: "Rear Delt Machine Fly", category_name: "Shoulders" },
  { name: "Arnold Dumbbell Press", category_name: "Shoulders" },
  { name: "One-Arm Standing Dumbbell Press", category_name: "Shoulders" },
  { name: "Cable Face Pull", category_name: "Shoulders" },
  { name: "Log Press", category_name: "Shoulders" },
  { name: "Smith Machine Overhead Press", category_name: "Shoulders" },
  { name: "Close Grip Barbell Bench Press", category_name: "Triceps" },
  { name: "V-Bar Push Down", category_name: "Triceps" },
  { name: "Parallel Bar Triceps Dip", category_name: "Triceps" },
  { name: "Lying Triceps Extension", category_name: "Triceps" },
  { name: "Rope Push Down", category_name: "Triceps" },
  { name: "Cable Overhead Triceps Extension", category_name: "Triceps" },
  { name: "EZ-Bar Skullcrusher", category_name: "Triceps" },
  { name: "Dumbbell Overhead Triceps Extension", category_name: "Triceps" },
  { name: "Ring Dip", category_name: "Triceps" },
  { name: "Smith Machine Close Grip Bench Press", category_name: "Triceps" },
  { name: "Barbell Curl", category_name: "Biceps" },
  { name: "EZ-Bar Curl", category_name: "Biceps" },
  { name: "Dumbbell Curl", category_name: "Biceps" },
  { name: "Seated Incline Dumbbell Curl", category_name: "Biceps" },
  { name: "Seated Machine Curl", category_name: "Biceps" },
  { name: "Dumbbell Hammer Curl", category_name: "Biceps" },
  { name: "Cable Curl", category_name: "Biceps" },
  { name: "EZ-Bar Preacher Curl", category_name: "Biceps" },
  { name: "Dumbbell Concentration Curl", category_name: "Biceps" },
  { name: "Dumbbell Preacher Curl", category_name: "Biceps" },
  { name: "Flat Barbell Bench Press", category_name: "Chest" },
  { name: "Flat Dumbbell Bench Press", category_name: "Chest" },
  { name: "Incline Barbell Bench Press", category_name: "Chest" },
  { name: "Decline Barbell Bench Press", category_name: "Chest" },
  { name: "Incline Dumbbell Bench Press", category_name: "Chest" },
  { name: "Flat Dumbbell Fly", category_name: "Chest" },
  { name: "Incline Dumbbell Fly", category_name: "Chest" },
  { name: "Cable Crossover", category_name: "Chest" },
  { name: "Incline Hammer Strength Chest Press", category_name: "Chest" },
  { name: "Decline Hammer Strength Chest Press", category_name: "Chest" },
  { name: "Seated Machine Fly", category_name: "Chest" },
  { name: "Deadlift", category_name: "Back" },
  { name: "Pull Up", category_name: "Back" },
  { name: "Chin Up", category_name: "Back" },
  { name: "Neutral Chin Up", category_name: "Back" },
  { name: "Dumbbell Row", category_name: "Back" },
  { name: "Barbell Row", category_name: "Back" },
  { name: "Pendlay Row", category_name: "Back" },
  { name: "Lat Pulldown", category_name: "Back" },
  { name: "Hammer Strength Row", category_name: "Back" },
  { name: "Seated Cable Row", category_name: "Back" },
  { name: "T-Bar Row", category_name: "Back" },
  { name: "Barbell Shrug", category_name: "Back" },
  { name: "Machine Shrug", category_name: "Back" },
  { name: "Straight-Arm Cable Pushdown", category_name: "Back" },
  { name: "Rack Pull", category_name: "Back" },
  { name: "Good Morning", category_name: "Back" },
  { name: "Barbell Squat", category_name: "Legs" },
  { name: "Barbell Front Squat", category_name: "Legs" },
  { name: "Leg Press", category_name: "Legs" },
  { name: "Leg Extension Machine", category_name: "Legs" },
  { name: "Seated Leg Curl Machine", category_name: "Legs" },
  { name: "Standing Calf Raise Machine", category_name: "Legs" },
  { name: "Donkey Calf Raise", category_name: "Legs" },
  { name: "Barbell Calf Raise", category_name: "Legs" },
  { name: "Barbell Glute Bridge", category_name: "Legs" },
  { name: "Glute-Ham Raise", category_name: "Legs" },
  { name: "Lying Leg Curl Machine", category_name: "Legs" },
  { name: "Romanian Deadlift", category_name: "Legs" },
  { name: "Stiff-Legged Deadlift", category_name: "Legs" },
  { name: "Sumo Deadlift", category_name: "Legs" },
  { name: "Seated Calf Raise Machine", category_name: "Legs" },
  { name: "Ab-Wheel Rollout", category_name: "Abs" },
  { name: "Cable Crunch", category_name: "Abs" },
  { name: "Crunch", category_name: "Abs" },
  { name: "Crunch Machine", category_name: "Abs" },
  { name: "Decline Crunch", category_name: "Abs" },
  { name: "Dragon Flag", category_name: "Abs" },
  { name: "Hanging Knee Raise", category_name: "Abs" },
  { name: "Hanging Leg Raise", category_name: "Abs" },
  { name: "Plank", category_name: "Abs" },
  { name: "Side Plank", category_name: "Abs" },
  { name: "Cycling", category_name: "Cardio" },
  { name: "Walking", category_name: "Cardio" },
  { name: "Rowing Machine", category_name: "Cardio" },
  { name: "Stationary Bike", category_name: "Cardio" },
  { name: "Swimming", category_name: "Cardio" },
  { name: "Running (Treadmill)", category_name: "Cardio" },
  { name: "Running (Outdoor)", category_name: "Cardio" },
  { name: "Elliptical Trainer", category_name: "Cardio" },
  { name: "Machine Row", category_name: "Back" },
  { name: "Chest Press (Machine)", category_name: "Chest" },
  { name: "Rope Tricep Extension", category_name: "Triceps" },
  { name: "Shoulder Press Machine", category_name: "Shoulders" },
  { name: "Lateral Cable Raise", category_name: "Shoulders" },
  { name: "Front Cable Raise", category_name: "Shoulders" },
  { name: "Pectoral Machine", category_name: "Chest" },
  { name: "Machine Low Row", category_name: "Back" },
  { name: "Shoulder Press", category_name: "Shoulders" },
  { name: "Assited Chest Dip", category_name: "Chest" },
  { name: "Seates Bicep Curl (Machine)", category_name: "Biceps" },
  { name: "EZ-Curl Front Raise", category_name: "Shoulders" },
  { name: "Dumbbell Shrug", category_name: "Shoulders" },
  { name: "Decline Leg Press", category_name: "Legs" },
  { name: "Standing Leg Curl", category_name: "Legs" },
  { name: "Rear Delt Row", category_name: "Back" },
];
