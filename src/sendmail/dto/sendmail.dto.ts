import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class SendMailDto {
  @IsEmail(
    {},
    {
      each: true,
      message:
        'Cada destinatario debe ser una dirección de correo electrónico válida',
    },
  )
  recipients: string[];

  @IsString({ message: 'El asunto debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El asunto no puede estar vacío' })
  subject: string;

  @IsString({ message: 'El contenido HTML debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El contenido HTML no puede estar vacío' })
  html: string;

  @IsOptional()
  @IsString({ message: 'El contenido de texto debe ser una cadena de texto' })
  text: string;
}
