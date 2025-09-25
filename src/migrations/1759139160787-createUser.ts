import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1759139160787 implements MigrationInterface {
    name = 'CreateUser1759139160787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vocabulary" ("id" SERIAL NOT NULL, "word" text NOT NULL, "meaning" text NOT NULL, "example" text, "audio_url" text, "image_url" text, "lessonId" integer, CONSTRAINT "PK_65dbd74f76cee79778299a2a21b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exercise_options" ("id" SERIAL NOT NULL, "option_text" text NOT NULL, "is_correct" boolean NOT NULL DEFAULT false, "exerciseId" integer, CONSTRAINT "PK_39a6564f867d8c3dde816919b4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."exercises_type_enum" AS ENUM('multiple_choice', 'fill_blank', 'listening')`);
        await queryRunner.query(`CREATE TABLE "exercises" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "question" text NOT NULL, "note" text NOT NULL, "type" "public"."exercises_type_enum" NOT NULL DEFAULT 'multiple_choice', "lessonId" integer, CONSTRAINT "PK_c4c46f5fa89a58ba7c2d894e3c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "progress" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "score" integer, "completed" boolean NOT NULL DEFAULT false, "userId" integer, "lessonId" integer, CONSTRAINT "PK_79abdfd87a688f9de756a162b6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lessons" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "title" text NOT NULL, "content" text, "video_url" text, "audio_url" text, "image_url" text, "courseId" integer, CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'completed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "payments" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "amount" numeric(10,2) NOT NULL, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "userId" integer, "courseId" integer, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."courses_level_enum" AS ENUM('beginner', 'intermediate', 'advanced')`);
        await queryRunner.query(`CREATE TABLE "courses" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "title" text NOT NULL, "description" text, "level" "public"."courses_level_enum" NOT NULL DEFAULT 'beginner', "price" numeric(10,2) NOT NULL DEFAULT '0', "teacherId" integer, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('student', 'teacher', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "full_name" text, "role" "public"."users_role_enum" NOT NULL DEFAULT 'student', "avatar_url" text, "refresh_token" text, "note" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vocabulary" ADD CONSTRAINT "FK_be0b01ddff82c8e950276666481" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exercise_options" ADD CONSTRAINT "FK_4b43b7f2f773cc29f19d2be5a7b" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exercises" ADD CONSTRAINT "FK_c7a7b90ae6ce91a6d8bcf09b8b6" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "FK_df6c728a3df388df34e03d08088" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "FK_1a9ff2409a84c76560ae8a92590" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_00097d3b3147848e3585aabb433" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_f921bd9bb6d061b90d386fa3721" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_f921bd9bb6d061b90d386fa3721"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_00097d3b3147848e3585aabb433"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "FK_1a9ff2409a84c76560ae8a92590"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "FK_df6c728a3df388df34e03d08088"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35"`);
        await queryRunner.query(`ALTER TABLE "exercises" DROP CONSTRAINT "FK_c7a7b90ae6ce91a6d8bcf09b8b6"`);
        await queryRunner.query(`ALTER TABLE "exercise_options" DROP CONSTRAINT "FK_4b43b7f2f773cc29f19d2be5a7b"`);
        await queryRunner.query(`ALTER TABLE "vocabulary" DROP CONSTRAINT "FK_be0b01ddff82c8e950276666481"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "courses"`);
        await queryRunner.query(`DROP TYPE "public"."courses_level_enum"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TABLE "lessons"`);
        await queryRunner.query(`DROP TABLE "progress"`);
        await queryRunner.query(`DROP TABLE "exercises"`);
        await queryRunner.query(`DROP TYPE "public"."exercises_type_enum"`);
        await queryRunner.query(`DROP TABLE "exercise_options"`);
        await queryRunner.query(`DROP TABLE "vocabulary"`);
    }

}
