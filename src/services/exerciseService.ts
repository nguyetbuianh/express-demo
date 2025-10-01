import { AppDataSource } from "../config/dataSource.ts";
import { Exercise } from "../models/Exercise.ts";
import { Lesson } from "../models/Lesson.ts";
import { ExerciseOption } from "../models/ExerciseOption.ts";
import { NotFoundError } from "../utils/appError.ts";
import { CreateExerciseDtoType } from "../dtos/exercise/exerciseInputDto.ts";
import { CreateExerciseOptionDtoType } from "../dtos/exerciseOption/exerciseOptionInputDto.ts";
import {
  ExerciseDetailResponseDto,
  ExerciseDetailResponseDtoType,
  ExerciseResponseDto,
  ExerciseResponseDtoType,
} from "../dtos/exercise/exerciseResponseDto.ts";
class ExerciseService {
  private exerciseRepo = AppDataSource.getRepository(Exercise);
  private lessonRepo = AppDataSource.getRepository(Lesson);
  private optionRepo = AppDataSource.getRepository(ExerciseOption);

  async createExercise(
    lessonId: number,
    exerciseData: CreateExerciseDtoType,
    options?: CreateExerciseOptionDtoType[]
  ): Promise<ExerciseResponseDtoType> {
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

    return ExerciseResponseDto.parse(savedExercise);
  }

  async getExercisesByLesson(
    lessonId: number
  ): Promise<ExerciseResponseDtoType[]> {
    const exercises = await this.exerciseRepo.find({
      where: { lesson: { id: lessonId } },
      relations: ["options", "lesson"],
    });

    return exercises.map((exercises) => ExerciseResponseDto.parse(exercises));
  }

  async getExerciseById(
    exerciseId: number
  ): Promise<ExerciseDetailResponseDtoType> {
    const exercises = await this.exerciseRepo.findOne({
      where: { id: exerciseId },
      relations: ["options", "lesson"],
    });

    return ExerciseDetailResponseDto.parse(exercises);
  }

  async updateExercise(
    exerciseId: number,
    exerciseData: CreateExerciseDtoType,
    options?: CreateExerciseOptionDtoType[]
  ): Promise<ExerciseResponseDtoType> {
    const exercise = await this.exerciseRepo.findOne({
      where: { id: exerciseId },
    });
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

    return ExerciseResponseDto.parse(exercise);
  }

  async deleteExercise(exerciseId: number): Promise<void> {
    const result = await this.exerciseRepo.delete(exerciseId);

    if (result.affected === 0) {
      throw new NotFoundError("Exercise not found");
    }
  }
}

export const exerciseService = new ExerciseService();
