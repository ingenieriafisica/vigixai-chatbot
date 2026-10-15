import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { answersProviders } from 'src/answers/answers.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders, ...answersProviders],
  exports: [UsersService, ...usersProviders],
})
export class UsersModule {}
