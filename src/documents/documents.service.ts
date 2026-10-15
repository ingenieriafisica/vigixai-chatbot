import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readdirSync } from 'fs';

@Injectable()
export class DocumentsService {
  handleFileUpload(file: Express.Multer.File) {
    const filePath = join(__dirname, '..', '..', 'uploads', file.filename);
    return {
      message: 'Archivo subido exitosamente',
      filename: file.filename,
      path: filePath,
    };
  }

  handleMultipleFileUpload(files: Express.Multer.File[]) {
    const fileInfos = files.map((file) => {
      const filePath = join(__dirname, '..', '..', 'uploads', file.filename);
      return {
        filename: file.filename,
        path: filePath,
      };
    });

    return {
      message: 'Archivos subidos exitosamente',
      files: fileInfos,
    };
  }

  getAllFiles() {
    const uploadsDir = join(__dirname, '..', '..', 'uploads');
    const files = readdirSync(uploadsDir); // Lee el directorio de archivos

    // Filtra solo archivos .txt, .doc, .docx
    const allowedFiles = files.filter(
      (file) =>
        file.endsWith('.txt') ||
        file.endsWith('.doc') ||
        file.endsWith('.docx'),
    );

    return allowedFiles;
  }

  getFilePath(filename: string) {
    const filePath = join(__dirname, '..', '..', 'uploads', filename);
    return filePath;
  }
}
