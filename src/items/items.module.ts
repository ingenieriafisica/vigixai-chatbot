import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ItemsProviders } from './items.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ItemsController],
  providers: [ItemsService, ...ItemsProviders],
})
export class ItemsModule {}
