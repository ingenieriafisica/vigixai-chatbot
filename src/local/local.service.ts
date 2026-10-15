import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SendPromptDto } from './dto/sendprompt.dto';
import { OllamaResponseDto } from './dto/ollamaresponse.dto';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class LocalService {
  private readonly ollamaBaseUrl = process.env.OLLAMA_BASE_URL!;
  private readonly defaultModel = process.env.OLLAMA_MODEL!;

  async sendPrompt(sendPromptDto: SendPromptDto): Promise<OllamaResponseDto> {
    const { prompt, model, temperature, max_tokens } = sendPromptDto;

    try {
      const response = await axios.post(
        `${this.ollamaBaseUrl}/api/generate`,
        {
          model: model || this.defaultModel,
          prompt: prompt,
          stream: false,
          options: {
            temperature: temperature || 0.1,
            num_predict: max_tokens || 130000,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 360000, // tiempo de espera
        },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new HttpException(
            'el servidor de modelos no está corriendo. por favor reinicie el servicio en el puerto localhost:11434',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }

        throw new HttpException(
          `Error en la API LLM: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Ocurrió un Error inesperado',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAvailableModels(): Promise<any> {
    try {
      const response = await axios.get(`${this.ollamaBaseUrl}/api/tags`);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener los modelos disponibles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getModelInfo(modelName: string = this.defaultModel): Promise<any> {
    try {
      const response = await axios.post(`${this.ollamaBaseUrl}/api/show`, {
        name: modelName,
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        `No se pudo obtener información del modelo: ${modelName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
