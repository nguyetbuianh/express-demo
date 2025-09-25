import { AppDataSource } from "../config/DataSource.ts";
import { Vocabulary } from "../models/Vocabulary.ts";
import { Lesson } from "../models/Lesson.ts";
import { NotFoundError } from "../utils/appError.ts";

class VocabularyService {
  private vocabRepo = AppDataSource.getRepository(Vocabulary);
  private lessonRepo = AppDataSource.getRepository(Lesson);

  async createVocabulary(lessonId: number, vocabData: Partial<Vocabulary>) {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) {
      throw new NotFoundError("Lesson not found");
    }

    const vocab = this.vocabRepo.create({ ...vocabData, lesson });

    return await this.vocabRepo.save(vocab);
  }

  async getVocabularyByLesson(lessonId: number) {
    return await this.vocabRepo.find({
      where: { lesson: { id: lessonId } },
      relations: ["lesson"],
    });
  }

  async getVocabularyById(id: number) {
    return await this.vocabRepo.findOne({
      where: { id },
      relations: ["lesson"],
    });
  }

  async updateVocabulary(id: number, data: Partial<Vocabulary>) {
    const vocab = await this.vocabRepo.findOne({ where: { id } });
    if (!vocab) {
      throw new Error("Vocabulary not found");
    }

    Object.assign(vocab, data);

    return await this.vocabRepo.save(vocab);
  }

  async deleteVocabulary(id: number) {
    const vocab = await this.vocabRepo.findOne({ where: { id } });
    if (!vocab) {
      throw new NotFoundError("Vocabulary not found");
    }

    return await this.vocabRepo.remove(vocab);
  }
}

export const vocabularyService = new VocabularyService();
