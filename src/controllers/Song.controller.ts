import { Request, Response } from 'express';
import multer, { MulterError } from 'multer';
import { ValidationError } from 'sequelize';
import { songs } from '../configs/multer';
import Album from '../models/Album.model';
import Profile from '../models/Profile.model';
import Song from '../models/Song.model';
import { CustomRequest, UserSession } from '../types/music-box';
import { slugGen } from '../utils/slugGen';

interface StoreRequestBody {
  name: string;
  albumSlug?: string;
  colaborators: string; //* colaborators será um array com os usernames dos colaboradores
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
        const { name, albumSlug, colaborators } = req.body;
        if (!name) return res.status(400).json({ error: ['Nome da música não enviado'] });

        const userSession = req.session.user as UserSession;

        const colaboratorsSlugs: string[] = colaborators ? JSON.parse(colaborators) : [];
        const authors = [...colaboratorsSlugs, userSession.username];

        //* caso seja enviado um usuário repetido, isso irá filtrar.
        const filteredAuthors = authors.filter((author, index) => authors.indexOf(author) === index);
        const profiles: Profile[] = [];

        for (const authorSlug of filteredAuthors) {
          const profile = await Profile.findOne({ where: { slug: authorSlug } });
          if (!profile) return res.status(400).json({ error: [`Autor '${authorSlug}' inexistente!`] });
          profiles.push(profile);
        }

        if (!req.file) {
          return res.status(400).json({ errors: ['Nenhuma música enviada!!'] });
        }

        const filepath = `http://localhost:3001/uploads/songs/${req.file.filename}`;

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
        return res.status(400).json({ errors: ['Música não encontrada'] });
      }
      const authors = await song.getProfiles();

      return res.status(200).json({ song, authors });
    } catch (error) {
      return res.status(500).json({ errors: ['Erro Desconhecido'] });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const userSession = req.session.user as UserSession;
      const song = await Song.findOne({ where: { slug: req.params.slug } });

      if (!song) {
        return res.status(400).json({ errors: ['Música não encontrada'] });
      }

      const profiles = await song.getProfiles();
      const profilesIds = profiles.map((profile) => profile.id);

      if (!profilesIds.includes(userSession.profileId)) {
        return res.status(401).json({ errors: ['Acesso Negado'] });
      }

      await song.destroy();
      return res.status(200).json({ message: 'Música excluída com sucesso' });
    } catch (error) {
      return res.status(500).json({ errors: ['Erro Desconhecido'] });
    }
  }
}

export default new SongController();