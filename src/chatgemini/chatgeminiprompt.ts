import { IsString, IsNotEmpty } from 'class-validator';
export class ChatgeminiPrompt {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
