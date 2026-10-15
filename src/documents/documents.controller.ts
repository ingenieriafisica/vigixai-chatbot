import {
  Controller,
  Get,
  Param,
  Res,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync } from 'fs';
import { DocumentsService } from './documents.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('upload')
export class DocumentsController {
  constructor(private readonly documentosService: DocumentsService) {}

  @Post('doc')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './documents',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'text/plain', // .txt
          'application/msword', // .doc
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error('Solo se permiten archivos TXT y Word (DOC, DOCX)'),
            false,
          );
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.documentosService.handleFileUpload(file);
  }

  @Post('docs')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './documents',
        filename: (req, file, cb) => {
          let filePath = join('./uploads', file.originalname);
          let counter = 1;
          while (existsSync(filePath)) {
            const ext = extname(file.originalname);
            const nameWithoutExt = file.originalname.replace(ext, '');
            filePath = join(
              './documents',
              `${nameWithoutExt}_${counter}${ext}`,
            );
            counter++;
          }

          cb(null, filePath);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'text/plain', // .txt
          'application/msword', // .doc
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error('Solo se permiten archivos TXT y Word (DOC, DOCX)'),
            false,
          );
        }
      },
    }),
  )
  uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.documentosService.handleMultipleFileUpload(files); // Manejo de múltiples archivos
  }

  @Get()
  getAllFiles() {
    const files = this.documentosService.getAllFiles(); // Adjust method name if needed
    return {
      files: files, // Devuelve la lista de archivos permitidos
    };
  }

  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.documentosService.getFilePath(filename); // Adjust method name if needed
    res.sendFile(filePath);
  }
}
