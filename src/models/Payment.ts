import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User.ts";
import { Course } from "./Course.ts";
import { BaseEntity } from "./BaseEntity.ts";

export const statusArray = ["pending", "completed", "failed"] as const;
export type Status = (typeof statusArray)[number];

@Entity("payments")
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  amount!: number;

  @Column({
    type: "enum",
    enum: statusArray,
    default: "pending",
  })
  status!: Status;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Course, (course) => course.payments, { onDelete: "CASCADE" })
  course!: Course;
}
