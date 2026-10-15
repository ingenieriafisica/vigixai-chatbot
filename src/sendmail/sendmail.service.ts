import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/sendmail.dto';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class SendMailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendMail(emailDto: SendMailDto): Promise<void> {
    const { recipients, subject, html, text } = emailDto;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipients.join(', '),
      subject,
      html,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Correo enviado a: ${recipients.join(', ')}`);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo.');
    }
  }
}
