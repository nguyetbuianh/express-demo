import { AppDataSource } from "../config/DataSource.ts";
import { Exercise } from "../models/Exercise.ts";
import { Lesson } from "../models/Lesson.ts";
import { ExerciseOption } from "../models/ExerciseOption.ts";
import { NotFoundError } from "../utils/appError.ts";
class ExerciseService {
  private exerciseRepo = AppDataSource.getRepository(Exercise);
  private lessonRepo = AppDataSource.getRepository(Lesson);
  private optionRepo = AppDataSource.getRepository(ExerciseOption);

  async createExercise(
    lessonId: number,
    exerciseData: Partial<Exercise>,
    options?: Partial<ExerciseOption>[]
  ) {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundError("Lesson not found");

    const exercise = this.exerciseRepo.create({ ...exerciseData, lesson });
    const savedExercise = await this.exerciseRepo.save(exercise);

    if (options && options.length > 0) {
      const opts = options.map((opt) =>
        this.optionRepo.create({ ...opt, exercise: savedExercise })
      );
      await this.optionRepo.save(opts);
      savedExercise.options = opts;
    }

    return savedExercise;
  }

  async getExercisesByLesson(lessonId: number) {
    return await this.exerciseRepo.find({
      where: { lesson: { id: lessonId } },
      relations: ["options", "lesson"],
    });
  }

  async getExerciseById(exerciseId: number) {
    return await this.exerciseRepo.findOne({
      where: { id: exerciseId },
      relations: ["options", "lesson"],
    });
  }

  async updateExercise(
    exerciseId: number,
    exerciseData: Partial<Exercise>,
    options?: Partial<ExerciseOption>[]
  ) {
    const exercise = await this.exerciseRepo.findOne({ where: { id: exerciseId } });
    if (!exercise) throw new NotFoundError("Exercise not found");

    Object.assign(exercise, exerciseData);
    await this.exerciseRepo.save(exercise);

    if (options) {
      await this.optionRepo.delete({ exercise: { id: exerciseId } });
      const opts = options.map((opt) =>
        this.optionRepo.create({ ...opt, exercise })
      );
      await this.optionRepo.save(opts);
      exercise.options = opts;
    }

    return exercise;
  }

  async deleteExercise(exerciseId: number) {
    const exercise = await this.exerciseRepo.findOne({ where: { id: exerciseId } });
    if (!exercise) throw new NotFoundError("Exercise not found");

    return await this.exerciseRepo.remove(exercise);
  }
}

export const exerciseService = new ExerciseService();
