import { Module } from '@nestjs/common';
import { LocalService } from './local.service';
import { LocalController } from './local.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [LocalController],
  providers: [LocalService],
})
export class LocalModule {}
