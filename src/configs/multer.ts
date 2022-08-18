import { Request } from 'express';
import multer, { FileFilterCallback, MulterError } from 'multer';
import path from 'path';
import { slugGen } from '../utils/slugGen';

//* essa função permite a reutilização do objeto "storage" do multer, alterando apenas a pasta de upload.
function storage(folder: string) {
  return {
    storage: multer.diskStorage({
      destination: (request, file, callback) => {
        callback(null, path.resolve(__dirname, '..', '..', 'static', 'uploads', folder));
      },

      filename: (request, file, callback) => {
        callback(null, slugGen() + path.extname(file.originalname));
      },
    }),
  };
}

//* essa função permite a reutilização do objeto "fileFilter" do multer, alterando apenas os tipos permitidos e a mensagem de erro.
function fileFilter(allowedTypes: string[], errorMessage: string) {
  return {
    fileFilter: (request: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
      if (!allowedTypes.includes(file.mimetype)) {
        callback(new MulterError('LIMIT_UNEXPECTED_FILE', errorMessage));
      }

      callback(null, true);
    },
  };
}

export const profileImage = {
  ...fileFilter(['image/jpeg', 'image/png'], 'arquivo não é uma imagem'),
  ...storage('images'),
};

export const songs = {
  ...fileFilter(['audio/mpeg', 'audio/wav'], 'arquivo não é um áudio'),
  ...storage('songs'),
};
