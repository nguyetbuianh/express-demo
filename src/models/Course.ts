import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User.ts";
import { Lesson } from "./Lesson.ts";
import { Payment } from "./Payment.ts";
import { BaseEntity } from "./BaseEntity.ts";

export const levelArray = ["beginner", "intermediate", "advanced"] as const;
export type Level = (typeof levelArray)[number];

@Entity("courses")
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "enum", enum: levelArray, default: "beginner" })
  level!: Level;

  @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
  price!: number;

  @ManyToOne(() => User, (user) => user.courses, { onDelete: "SET NULL" })
  teacher!: User;

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons!: Lesson[];

  @OneToMany(() => Payment, (payment) => payment.course)
  payments!: Payment[];
}
