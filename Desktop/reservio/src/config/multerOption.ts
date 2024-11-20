import { HttpException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

// Helper function to ensure directories exist
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

// Update multerOption to handle absolute paths and ensure directories exist
const multerOption = (folderPath: string, ext: string[]): MulterOptions => {
  const absolutePath = path.join(__dirname, '..', 'uploads', folderPath);

  // Ensure directory exists
  mkdirp.sync(absolutePath);

  const multerConfig: MulterOptions = {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, absolutePath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
      },
    }),
    fileFilter: (req, file, cb) => {
      const extension = file.mimetype.split('/')[1];
      if (!ext.includes(extension)) {
        return cb(
          new HttpException(
            `Extension not allowed, only ${ext.join(', ')} is allowed`,
            400,
          ),
          false,
        );
      }
      return cb(null, true);
    },
  };

  return multerConfig;
};

export default multerOption;
