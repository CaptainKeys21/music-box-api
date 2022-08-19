//!! ESSE ARQUIVO PROVAVELMENTE SERÁ APAGADO NA PRODUÇÃO

import { Request, Response } from 'express';
import Genre from '../models/Genre.model';

class GenreController {
  async store(req: Request, res: Response) {
    Genre.create({ name: 'Metal' });
    Genre.create({ name: 'Pop' });
    Genre.create({ name: 'Funk' });
    Genre.create({ name: 'Rock' });
    Genre.create({ name: 'Sertanejo' });
    Genre.create({ name: 'Rap' });

    res.json('criado os gêneros');
  }
}

export default new GenreController();
