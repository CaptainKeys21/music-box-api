import { Request, Response } from 'express';
import multer, { MulterError } from 'multer';
import { ValidationError } from 'sequelize';
import { songs } from '../configs/multer';
import Album from '../models/Album.model';
import Profile from '../models/Profile.model';
import Song from '../models/Song.model';
import { CustomRequest } from '../types/music-box';
import { slugGen } from '../utils/slugGen';

interface StoreRequestBody {
  name: string;
  albumSlug?: string;
  authors: string; //* authors será um array com os slugs dos autores
}

const upload = multer(songs).single('song');

class SongController {
  async store(req: CustomRequest<StoreRequestBody>, res: Response): Promise<void> {
    return upload(req, res, async (error): Promise<Response> => {
      if (error instanceof MulterError) {
        return res.status(400).json({ errors: [error.field] });
      } else if (error) {
        return res.status(400).json({ errors: error });
      }

      try {
        const { name, albumSlug, authors } = req.body;

        if (!name) return res.status(400).json({ error: ['Nome da música não enviado'] });
        if (!authors) return res.status(400).json({ error: ['Nenhum autor foi não enviado'] });

        const authorsArray: string[] = JSON.parse(authors);
        if (authorsArray.length === 0) return res.status(400).json({ error: ['Nenhum autor foi não enviado'] });

        if (!req.file) {
          return res.status(400).json({ errors: ['Nenhuma música enviada!!'] });
        }

        const filepath = `http://localhost:3001/uploads/songs/${req.file.filename}`;

        const profiles: Profile[] = [];

        for (const authorSlug of authorsArray) {
          const profile = await Profile.findOne({ where: { slug: authorSlug } });
          if (!profile) return res.status(400).json({ error: [`Autor '${authorSlug}' inexistente!`] });
          profiles.push(profile);
        }

        const song = await Song.create({ name, filename: filepath, slug: slugGen() });
        song.setProfiles(profiles);

        if (albumSlug) {
          const album = await Album.findOne({ where: { slug: albumSlug } });
          if (!album) return res.status(400).json({ errors: ['álbum inexistente!'] });
          await song.setAlbum(album);
        } else {
          await song.createAlbum({ name, slug: slugGen(), single: true });
        }

        return res.status(200).json(song);
      } catch (error) {
        if (error instanceof ValidationError) {
          return res.status(400).json({ errors: error.errors.map((err) => err.message) });
        }
        console.log(error);
        return res.status(500).json({ errors: ['Erro desconhecido'] });
      }
    });
  }

  //* provavelmente não será usado
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const songs = await Song.findAll();

      return res.status(200).json(songs);
    } catch (error) {
      return res.status(500).json({ errors: ['erro'] });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const song = await Song.findOne({ where: { slug: req.params.slug } });
      if (!song) {
        return res.status(404).json({ errors: ['Música não encontrada'] });
      }
      const authors = await song.getProfiles();

      return res.status(200).json({ song, authors });
    } catch (error) {
      return res.status(500).json({ errors: ['Erro Desconhecido'] });
    }
  }
}

export default new SongController();
