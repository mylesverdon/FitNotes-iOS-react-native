import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exercise } from "./Exercise";

@Entity("category")
export class Category {
  constructor(name: string, color?: string, sortOrder?: number) {
    this.name = name;
    color && (this.colour = color);
    sortOrder && (this.sort_order = sortOrder);
  }

  @PrimaryGeneratedColumn("increment")
  _id: number;

  @Column()
  name: string;

  @Column()
  colour: string;

  @Column({ default: 0 })
  sort_order: number;

  @OneToMany(() => Exercise, (exercise) => exercise.category)
  exercises: Exercise[];
}

export const defaults = [
  { id: 1, name: "Shoulders", colour: "#F54336" },
  { id: 2, name: "Triceps", colour: "#EE2C2C" },
  { id: 3, name: "Biceps", colour: "#FF00FF" },
  { id: 4, name: "Chest", colour: "#FDB813" },
  { id: 5, name: "Back", colour: "#E5053A" },
  { id: 6, name: "Legs", colour: "#D7DF01" },
  { id: 7, name: "Abs", colour: "#FF00CC" },
  { id: 8, name: "Cardio", colour: "#FFD300" },
];
