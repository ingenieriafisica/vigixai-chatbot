import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatgeminiPrompt } from './chatgeminiprompt';
import * as dotenv from 'dotenv';
dotenv.config();

function validateEnvironmentVariables(): void {
  const requiredVariables = ['MONGODB_ATLAS_URI', 'GOOGLE_API_KEY'];
  const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable],
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Variables de entorno no existen: ${missingVariables.join(
        ', ',
      )}. Por favor revise su archivo \`.env\`.`,
    );
  }
}

@Injectable()
export class ChatgeminiService implements OnModuleInit, OnModuleDestroy {
  private mongoClient: MongoClient | null = null;
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    validateEnvironmentVariables();
  }

  async onModuleInit(): Promise<void> {
    try {
      this.mongoClient = new MongoClient(
        process.env.MONGODB_ATLAS_URI as string,
      );
      await this.mongoClient.connect();
      console.log('Se conectó exitosamente a la Base de Datos MongoDB.');
      this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
      console.log('Modelo generativo gemini de google inicializado con éxito.');
    } catch (error) {
      console.error('Error iniciando ChatxaiService:', error);
      await this.cleanup();
      throw error;
    }
  }

  public async getChatCompletion(prompt: ChatgeminiPrompt): Promise<string> {
    if (!this.genAI) {
      throw new Error(
        'el modelo generativo gemini de google no se ha iniciado.',
      );
    }

    try {
      const augmentedPrompt = `Pregunta del usuario:\n${prompt.prompt}`;
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });
      const result = await model.generateContent(augmentedPrompt);
      const rawResponse = result.response.text();
      try {
        const parsedResponse = JSON.parse(rawResponse);
        return parsedResponse;
      } catch (e) {
        console.error('No se pudo parsear la respuesta:', e);
        return rawResponse;
      }
    } catch (error) {
      console.error(
        'Error generando la respuesta con gemini de google:',
        error,
      );
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.cleanup();
    console.log('ChatxaiService destruido con éxito.');
  }

  private async cleanup(): Promise<void> {
    try {
      if (this.mongoClient) {
        await this.mongoClient.close();
        console.log('Conexión a la BD cerrada.');
      }
    } catch (error) {
      console.error(
        'Error al tratar de cerrar la conexión con MongoDB:',
        error,
      );
    }

    this.mongoClient = null;
    this.genAI = null;
    console.log('recursos usados por ChatxaiService restaurados con éxito.');
  }
}
