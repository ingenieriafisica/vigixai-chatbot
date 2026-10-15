import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { AnswerResponseDto } from './dto/answer-response.dto';

@Controller('answers')
@SerializeOptions({ strategy: 'excludeAll' })
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAnswer(
    @Body() createAnswerDto: CreateAnswerDto,
  ): Promise<AnswerResponseDto> {
    const answer = await this.answersService.create(createAnswerDto);
    return new AnswerResponseDto(answer);
  }

  @Get()
  async getAllAnswers(): Promise<AnswerResponseDto[]> {
    const answers = await this.answersService.findAll();
    return answers.map(a => new AnswerResponseDto(a));
  }

  @Get(':id')
  async getAnswerById(@Param('id') id: string): Promise<AnswerResponseDto> {
    const answer = await this.answersService.findOne(id);
    return new AnswerResponseDto(answer);
  }

  @Patch(':id')
  async updateAnswer(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ): Promise<AnswerResponseDto> {
    const answer = await this.answersService.update(id, updateAnswerDto);
    return new AnswerResponseDto(answer);
  }

  @Put(':id')
  async putAnswer(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ): Promise<AnswerResponseDto> {
    const answer = await this.answersService.update(id, updateAnswerDto);
    return new AnswerResponseDto(answer);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteAnswer(@Param('id') id: string): Promise<{ message: string }> {
    await this.answersService.remove(id);
    return { message: 'Respuesta eliminada correctamente' };
  }
}