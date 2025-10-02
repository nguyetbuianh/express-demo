import { AppDataSource } from "../config/dataSource.ts";
import { Vocabulary } from "../models/Vocabulary.ts";
import { Lesson } from "../models/Lesson.ts";
import { NotFoundError } from "../utils/appError.ts";
import {
  CreateVocabularyDtoType,
  UpdateVocabularyDtoType,
} from "../dtos/vocabulary/vocabInputDto.ts";
import {
  VocabResponseDto,
  VocabResponseDtoType,
} from "../dtos/vocabulary/vocabResponseDto.ts";
import { PaginationParams } from "../utils/pagination.ts";

class VocabularyService {
  private vocabRepo = AppDataSource.getRepository(Vocabulary);
  private lessonRepo = AppDataSource.getRepository(Lesson);

  async createVocabulary(
    lessonId: number,
    vocabData: CreateVocabularyDtoType
  ): Promise<VocabResponseDtoType> {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) {
      throw new NotFoundError("Lesson not found");
    }

    const vocab = this.vocabRepo.create({ ...vocabData, lesson });
    const vocabSaved = await this.vocabRepo.save(vocab);

    return VocabResponseDto.parse(vocabSaved);
  }

  async getVocabularyByLesson(
    lessonId: number,
    pagination: PaginationParams
  ): Promise<{ vocabData: VocabResponseDtoType[]; total: number }> {
    const [vocabs, total] = await this.vocabRepo.findAndCount({
      where: { lesson: { id: lessonId } },
      relations: ["lesson"],
      order: { id: "ASC" },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });

    return {
      vocabData: vocabs.map((vocabs) => VocabResponseDto.parse(vocabs)),
      total,
    };
  }

  async getVocabularyById(vocabId: number): Promise<VocabResponseDtoType> {
    const vocab = await this.vocabRepo.findOne({
      where: { id: vocabId },
      relations: ["lesson"],
    });

    return VocabResponseDto.parse(vocab);
  }

  async updateVocabulary(
    vocabId: number,
    data: UpdateVocabularyDtoType
  ): Promise<VocabResponseDtoType> {
    const vocab = await this.vocabRepo.findOne({ where: { id: vocabId } });
    if (!vocab) {
      throw new Error("Vocabulary not found");
    }

    Object.assign(vocab, data);
    const vocabSaved = await this.vocabRepo.save(vocab);

    return VocabResponseDto.parse(vocabSaved);
  }

  async deleteVocabulary(vocabId: number): Promise<void> {
    const result = await this.vocabRepo.delete(vocabId);

    if (result.affected === 0) {
      throw new NotFoundError("Vocabulary not found");
    }
  }
}

export const vocabularyService = new VocabularyService();
