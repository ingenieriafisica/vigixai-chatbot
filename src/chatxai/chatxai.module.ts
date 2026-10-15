import { Module } from '@nestjs/common';
import { ChatxaiService } from './chatxai.service';
import { ChatxaiController } from './chatxai.controller';

@Module({
  controllers: [ChatxaiController],
  providers: [ChatxaiService],
})
export class ChatxaiModule {}
