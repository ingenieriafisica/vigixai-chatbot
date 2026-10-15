import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { PromptResponseDto } from './dto/prompt-response.dto';

@Controller('prompts')
@SerializeOptions({ strategy: 'excludeAll' })
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPromptDto: CreatePromptDto): Promise<PromptResponseDto> {
    const prompt = await this.promptsService.create(createPromptDto);
    return new PromptResponseDto(prompt);
  }

  @Get()
  async findAll(): Promise<PromptResponseDto[]> {
    const prompts = await this.promptsService.findAll();
    return prompts.map(p => new PromptResponseDto(p));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PromptResponseDto> {
    const prompt = await this.promptsService.findOne(id);
    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found.`);
    }
    return new PromptResponseDto(prompt);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePromptDto: UpdatePromptDto,
  ): Promise<PromptResponseDto> {
    const updatedPrompt = await this.promptsService.update(id, updatePromptDto);
    if (!updatedPrompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found or couldn't be updated.`);
    }
    return new PromptResponseDto(updatedPrompt);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.promptsService.remove(id);
    return { message: 'Prompt eliminado correctamente' };
  }
}