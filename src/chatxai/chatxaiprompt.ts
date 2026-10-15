import { IsString, IsNotEmpty } from 'class-validator';
export class ChatxaiPrompt {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
