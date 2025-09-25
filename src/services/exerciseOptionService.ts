import { AppDataSource } from "../config/DataSource.ts";
import { ExerciseOption } from "../models/ExerciseOption.ts";
import { Exercise } from "../models/Exercise.ts";
import { NotFoundError } from "../utils/appError.ts";

class ExerciseOptionService {
  private optionRepo = AppDataSource.getRepository(ExerciseOption);
  private exerciseRepo = AppDataSource.getRepository(Exercise);

  async addOption(exerciseId: number, optionData: Partial<ExerciseOption>) {
    const exercise = await this.exerciseRepo.findOne({
      where: { id: exerciseId },
    });
    if (!exercise) throw new NotFoundError("Exercise not found");

    const option = this.optionRepo.create({ ...optionData, exercise });

    return await this.optionRepo.save(option);
  }

  async updateOption(
    exerciseOptId: number,
    optionData: Partial<ExerciseOption>
  ) {
    const option = await this.optionRepo.findOne({
      where: { id: exerciseOptId },
    });
    if (!option) throw new NotFoundError("Option not found");

    Object.assign(option, optionData);

    return await this.optionRepo.save(option);
  }

  async deleteOption(exerciseOptId: number) {
    const option = await this.optionRepo.findOne({
      where: { id: exerciseOptId },
    });
    if (!option) throw new Error("Option not found");
    
    return await this.optionRepo.remove(option);
  }
}

export const exerciseOptionService = new ExerciseOptionService();
