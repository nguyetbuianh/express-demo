import { PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

export abstract class BaseEntity {
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
