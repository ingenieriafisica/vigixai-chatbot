import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatgeminiService } from './chatgemini.service';
import { ChatgeminiPrompt } from './chatgeminiprompt';

@Controller('chat')
export class ChatgeminiController {
  constructor(private readonly chatgeminiService: ChatgeminiService) {}

  @Post('flash')
  async generateResponse(
    @Body() prompt: ChatgeminiPrompt,
  ): Promise<{ response: string }> {
    try {
      if (!prompt || !prompt.prompt) {
        throw new HttpException(
          'El campo prompt es requerido',
          HttpStatus.BAD_REQUEST,
        );
      }
      const response = await this.chatgeminiService.getChatCompletion(prompt);
      return { response };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : '';
      const stack = error instanceof Error ? error.stack : undefined;
      console.error('Error generando la respuesta:', message, stack);
      throw new HttpException(
        message || 'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
