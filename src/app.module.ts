import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewsModule } from './reviews/reviews.module';
import { DatabaseModule } from './database/database.module';
import { PromptsModule } from './prompts/prompts.module';
import { AnswersModule } from './answers/answers.module';
import { UsersModule } from './users/users.module';
import { LoggingInterceptor } from './loggin.interceptor';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { MulterModule } from '@nestjs/platform-express';
import { LocalModule } from './local/local.module';
import { NormsModule } from './norms/norms.module';
import { ChatxaiModule } from './chatxai/chatxai.module';
import { SendmailModule } from './sendmail/sendmail.module';
import { ItemsModule } from './items/items.module';
import { ChatgeminiModule } from './chatgemini/chatgemini.module';

@Module({
  imports: [
    DatabaseModule,
    ReviewsModule,
    PromptsModule,
    AnswersModule,
    UsersModule,
    AuthModule,
    DocumentsModule,
    MulterModule,
    LocalModule,
    NormsModule,
    ChatxaiModule,
    SendmailModule,
    ItemsModule,
    ChatgeminiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
