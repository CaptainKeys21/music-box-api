import { Response } from 'express';
import multer, { MulterError } from 'multer';
import { ValidationError } from 'sequelize';
import { songs } from '../../configs/multer';
import Album from '../../models/Album.model';
import Genre from '../../models/Genre.model';
import Profile from '../../models/Profile.model';
import Song from '../../models/Song.model';
import { CustomRequest, UserSession } from '../../types/music-box';
import { filterDuplicateNames } from '../../utils/filterDuplicateNames';
import { slugGen } from '../../utils/slugGen';

interface StoreRequestBody {
  name: string;
  genres: string; //* array de gêneros (pelo menos um gênero)
  album?: string;
  colaborators?: string; //* colaborators será um array com os usernames dos colaboradores
}

const upload = multer(songs).single('song');

export async function store(req: CustomRequest<StoreRequestBody>, res: Response): Promise<void> {
  return upload(req, res, async (error): Promise<Response> => {
    if (error instanceof MulterError) {
      return res.status(400).json({ errors: [error.field] });
    } else if (error) {
      return res.status(400).json({ errors: error });
    }

    try {
      const userSession = req.session.user as UserSession;

      const { name, album, colaborators, genres } = req.body;
      if (!name) return res.status(400).json({ error: ['Nome da música não enviado'] });
      if (!genres) return res.status(400).json({ error: ['Nenhum gênero foi enviado'] });

      const genresNames: string[] = JSON.parse(genres);
      if (genresNames.length === 0) return res.status(400).json({ error: ['Nenhum gênero foi enviado'] });
      const filteredGenres = filterDuplicateNames(genresNames);

      const genresArray: Genre[] = [];
      for (const genreName of filteredGenres) {
        const genre = await Genre.findOne({ where: { name: genreName } });
        if (!genre) return res.status(400).json({ error: [`Gênero '${genreName}' inexistente!`] });
        genresArray.push(genre);
      }

      const colaboratorsSlugs: string[] = colaborators ? JSON.parse(colaborators) : [];
      const authors = [...colaboratorsSlugs, userSession.username];
      const filteredAuthors = filterDuplicateNames(authors);

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
      song.setGenres(genresArray);

      if (album) {
        const FoundAlbum = await Album.findOne({ where: { slug: album } });
        if (!FoundAlbum) return res.status(400).json({ errors: ['álbum inexistente!'] });
        await song.setAlbum(FoundAlbum);
      } else {
        await song.createAlbum({ name, slug: slugGen(), single: true });
      }

      const songGenres = (await song.getGenres()).map((genre) => genre.name);

      return res.status(200).json({ song, genres: songGenres });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ errors: error.errors.map((err) => err.message) });
      }
      console.log(error);
      return res.status(500).json({ errors: ['Erro desconhecido'] });
    }
  });
}
