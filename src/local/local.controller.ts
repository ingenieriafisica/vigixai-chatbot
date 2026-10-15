import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LocalService } from './local.service';
import { SendPromptDto } from './dto/sendprompt.dto';
import { OllamaResponseDto } from './dto/ollamaresponse.dto';

@Controller('local')
export class LocalController {
  constructor(private readonly publicbotService: LocalService) {}

  @Post()
  async sendPrompt(
    @Body() sendPromptDto: SendPromptDto,
  ): Promise<OllamaResponseDto> {
    try {
      return await this.publicbotService.sendPrompt(sendPromptDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('models')
  async getAvailableModels(): Promise<any> {
    try {
      return await this.publicbotService.getAvailableModels();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('model/:modelName?')
  async getModelInfo(@Param('modelName') modelName?: string): Promise<any> {
    try {
      return await this.publicbotService.getModelInfo(modelName);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      // Try to get available models as a health check
      await this.publicbotService.getAvailableModels();
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        'Ollama service is unreachable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
