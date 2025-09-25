import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User.ts";
import { Lesson } from "./Lesson.ts";
import { BaseEntity } from "./BaseEntity.ts";

@Entity("progress")
export class Progress extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", nullable: true })
  score?: number;

  @Column({ type: "boolean", default: false })
  completed!: boolean;

  @ManyToOne(() => User, (user) => user.progress, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Lesson, (lesson) => lesson.progress, {
    onDelete: "CASCADE",
  })
  lesson!: Lesson;
}
