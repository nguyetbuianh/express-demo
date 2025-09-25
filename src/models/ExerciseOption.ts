import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Exercise } from "./Exercise.ts";

@Entity("exercise_options")
export class ExerciseOption {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "option_text", type: "text" })
  optionText!: string;

  @Column({ name: "is_correct", type: "boolean", default: false })
  isCorrect!: boolean;

  @ManyToOne(() => Exercise, (exercise: Exercise) => exercise.options, {
    onDelete: "CASCADE",
  })
  exercise!: Exercise;
}
