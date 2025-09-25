import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Course } from "./Course.ts";
import { Progress } from "./Progress.ts";
import { Payment } from "./Payment.ts";
import { BaseEntity } from "./BaseEntity.ts";

export const userRolesArray = ["student", "teacher", "admin"] as const;
export type UserRole = typeof userRolesArray[number];
@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", unique: true })
  email!: string;

  @Column({ type: "text", select: false })
  password!: string;

  @Column({ name: "full_name", type: "text", nullable: true })
  fullName?: string;

  @Column({
    type: "enum",
    enum: userRolesArray,
    default: "student",
  })
  role!: UserRole;

  @Column({ name: "avatar_url", type: "text", nullable: true })
  avatarUrl?: string;

  @Column({
    name: "refresh_token",
    type: "text",
    nullable: true,
    select: false,
  })
  refreshToken!: string | null;

  @OneToMany(() => Course, (course: Course) => course.teacher)
  courses!: Course[];

  @OneToMany(() => Progress, (progress) => progress.user)
  progress!: Progress[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];
}
