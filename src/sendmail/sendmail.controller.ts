import { Controller, Post, Body } from '@nestjs/common';
import { SendMailDto } from './dto/sendmail.dto';
import { SendMailService } from './sendmail.service';

@Controller('email')
export class SendMailController {
  constructor(private readonly sendEmailService: SendMailService) {}

  @Post('soporte')
  async sendTestEmail(@Body() emailDto: SendMailDto) {
    await this.sendEmailService.sendMail(emailDto);
    return { message: 'Correo enviado con éxito.' };
  }
}
