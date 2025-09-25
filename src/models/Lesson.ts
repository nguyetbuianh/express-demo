import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Course } from "./Course.ts";
import { Vocabulary } from "./Vocabulary.ts";
import { Exercise } from "./Exercise.ts";
import { Progress } from "./Progress.ts";
import { BaseEntity } from "./BaseEntity.ts";

@Entity("lessons")
export class Lesson extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text", nullable: true })
  content?: string;

  @Column({ name: "video_url", type: "text", nullable: true })
  videoUrl?: string;

  @Column({ name: "audio_url", type: "text", nullable: true })
  audioUrl?: string;

  @Column({ name: "image_url", type: "text", nullable: true })
  imageUrl?: string;

  @ManyToOne(() => Course, (course) => course.lessons, {
    onDelete: "CASCADE",
  })
  course!: Course;

  @OneToMany(() => Vocabulary, (vocab) => vocab.lesson)
  vocabulary!: Vocabulary[];

  @OneToMany(() => Exercise, (exercise) => exercise.lesson)
  exercises!: Exercise[];

  @OneToMany(() => Progress, (progress) => progress.lesson)
  progress!: Progress[];
}
