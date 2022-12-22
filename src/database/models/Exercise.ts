import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("exercise")
export class Exercise {
  constructor(name: number, categoryId: number) {
    this.name = name;
    this.category_id = categoryId;
  }

  @PrimaryGeneratedColumn("increment")
  _id: number;

  @Column()
  name: number;

  @Column()
  category_id: number;

  @Column({ default: 0 })
  exercise_type_id: number;

  @Column()
  notes: number;

  @Column()
  weight_increment: number;

  @Column()
  default_graph_id: number;

  @Column()
  default_rest_time: number;
}

export const defaultExercises = [
  { _id: 1, name: "Overhead Press", category_id: 1 },
  { _id: 2, name: "Seated Dumbbell Press", category_id: 1 },
  { _id: 3, name: "Lateral Dumbbell Raise", category_id: 1 },
  { _id: 4, name: "Front Dumbbell Raise", category_id: 1 },
  { _id: 5, name: "Push Press", category_id: 1 },
  { _id: 6, name: "Behind The Neck Barbell Press", category_id: 1 },
  { _id: 7, name: "Hammer Strength Shoulder Press", category_id: 1 },
  { _id: 8, name: "Seated Dumbbell Lateral Raise", category_id: 1 },
  { _id: 9, name: "Lateral Machine Raise", category_id: 1 },
  { _id: 10, name: "Rear Delt Dumbbell Raise", category_id: 1 },
  { _id: 11, name: "Rear Delt Machine Fly", category_id: 1 },
  { _id: 12, name: "Arnold Dumbbell Press", category_id: 1 },
  { _id: 13, name: "One-Arm Standing Dumbbell Press", category_id: 1 },
];
