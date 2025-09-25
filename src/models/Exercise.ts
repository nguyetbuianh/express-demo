import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Lesson } from "./Lesson.ts";
import { ExerciseOption } from "./ExerciseOption.ts";
import { BaseEntity } from "./BaseEntity.ts";

export const typeQuestionArray = [
  "multiple_choice",
  "fill_blank",
  "listening",
] as const;
export type TypeQuestion = (typeof typeQuestionArray)[number];

@Entity("exercises")
export class Exercise extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  question!: string;

  @Column({
    type: "enum",
    enum: typeQuestionArray,
    default: "multiple_choice",
  })
  type!: TypeQuestion;

  @ManyToOne(() => Lesson, (lesson) => lesson.exercises, {
    onDelete: "CASCADE",
  })
  lesson!: Lesson;

  @OneToMany(() => ExerciseOption, (option) => option.exercise, { cascade: true })
  options!: ExerciseOption[];
}
