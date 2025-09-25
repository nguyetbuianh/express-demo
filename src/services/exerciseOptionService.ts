import { AppDataSource } from "../config/DataSource.ts";
import { ExerciseOption } from "../models/ExerciseOption.ts";
import { Exercise } from "../models/Exercise.ts";
import { NotFoundError } from "../utils/appError.ts";
import {
  ExerciseOptionResponseDto,
  ExerciseOptionResponseDtoType,
} from "../dtos/exerciseOption/exerciseOptionResponseDto.ts";
import {
  CreateExerciseOptionDtoType,
  UpdateExerciseOptionDtoType,
} from "../dtos/exerciseOption/exerciseOptionInputDto.ts";

class ExerciseOptionService {
  private optionRepo = AppDataSource.getRepository(ExerciseOption);
  private exerciseRepo = AppDataSource.getRepository(Exercise);

  async addOption(
    exerciseId: number,
    optionData: CreateExerciseOptionDtoType
  ): Promise<ExerciseOptionResponseDtoType> {
    const exercise = await this.exerciseRepo.findOne({
      where: { id: exerciseId },
    });
    if (!exercise) throw new NotFoundError("Exercise not found");

    const option = this.optionRepo.create({ ...optionData, exercise });
    const savedOption = await this.optionRepo.save(option);

    return ExerciseOptionResponseDto.parse(savedOption);
  }

  async updateOption(
    exerciseOptId: number,
    optionData: UpdateExerciseOptionDtoType
  ): Promise<ExerciseOptionResponseDtoType> {
    const option = await this.optionRepo.findOne({
      where: { id: exerciseOptId },
    });
    if (!option) throw new NotFoundError("Option not found");

    Object.assign(option, optionData);
    const savedOption = await this.optionRepo.save(option);

    return ExerciseOptionResponseDto.parse(savedOption);
  }

  async deleteOption(exerciseOptId: number): Promise<void> {
    const result = await this.optionRepo.delete(exerciseOptId);

    if (result.affected === 0) {
      throw new NotFoundError("Option not found");
    }
  }
}

export const exerciseOptionService = new ExerciseOptionService();
