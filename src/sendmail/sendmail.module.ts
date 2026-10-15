import { Module } from '@nestjs/common';
import { SendMailService } from './sendmail.service';
import { SendMailController } from './sendmail.controller';

@Module({
  controllers: [SendMailController],
  providers: [SendMailService],
  exports: [SendMailService],
})
export class SendmailModule {}
