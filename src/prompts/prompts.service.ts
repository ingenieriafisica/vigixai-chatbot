import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { Model } from 'mongoose';
import { Prompt } from './entities/prompt.schema';

@Injectable()
export class PromptsService {
  constructor(@Inject('PROMPTS_MODEL') private promptModel: Model<Prompt>) {}

  async create(createPromptDto: CreatePromptDto): Promise<Prompt> {
    const newPrompt = new this.promptModel(createPromptDto);
    return await newPrompt.save();
  }

  async findAll(): Promise<Prompt[]> {
    return this.promptModel.find().exec();
  }

  async findOne(id: string): Promise<Prompt | null> {
    return this.promptModel.findById(id).exec();
  }

  async update(
    id: string,
    updatePromptDto: UpdatePromptDto,
  ): Promise<Prompt | null> {
    // 🔒 Filtrado explícito - allowlist
    const allowedFields = ['role', 'content'];
    const sanitizedData: Record<string, any> = {};
    
    for (const field of allowedFields) {
      const value = (updatePromptDto as any)[field];
      if (value !== undefined) {
        sanitizedData[field] = value;
      }
    }

    return this.promptModel
      .findByIdAndUpdate(id, sanitizedData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Prompt | null> {
    return this.promptModel.findByIdAndDelete(id).exec();
  }
}