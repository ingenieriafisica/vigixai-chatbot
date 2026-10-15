import { Module } from '@nestjs/common';
import { ChatgeminiService } from './chatgemini.service';
import { ChatgeminiController } from './chatgemini.controller';

@Module({
  controllers: [ChatgeminiController],
  providers: [ChatgeminiService],
})
export class ChatgeminiModule {}
