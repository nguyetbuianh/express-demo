import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from "../models/User.ts";
import { Course } from "../models/Course.ts";
import { Lesson } from "../models/Lesson.ts";
import { Vocabulary } from "../models/Vocabulary.ts";
import { Exercise } from "../models/Exercise.ts";
import { ExerciseOption } from "../models/ExerciseOption.ts";
import { Progress } from "../models/Progress.ts";
import { Payment } from "../models/Payment.ts";
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  synchronize: true,
  logging: false,
  entities: [
    User,
    Course,
    Lesson,
    Vocabulary,
    Exercise,
    ExerciseOption,
    Progress,
    Payment,
  ],
});

export default AppDataSource;