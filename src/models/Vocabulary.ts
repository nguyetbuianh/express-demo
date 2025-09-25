import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Lesson } from "./Lesson.ts";

@Entity("vocabulary")
export class Vocabulary {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  word!: string;

  @Column({ type: "text" })
  meaning!: string;

  @Column({ type: "text", nullable: true })
  example?: string;

  @Column({ type: "text", nullable: true })
  audio_url?: string;

  @Column({ type: "text", nullable: true })
  image_url?: string;

  @ManyToOne(() => Lesson, (lesson: Lesson) => lesson.vocabulary, {
    onDelete: "CASCADE",
  })
  lesson!: Lesson;
}
