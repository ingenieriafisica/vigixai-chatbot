import { Module } from '@nestjs/common';
import { NormsService } from './norms.service';
import { NormsController } from './norms.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { normsProviders } from './norms.providers';

@Module({
  imports: [DatabaseModule, MongooseModule],
  controllers: [NormsController],
  providers: [NormsService, ...normsProviders],
})
export class NormsModule {}
