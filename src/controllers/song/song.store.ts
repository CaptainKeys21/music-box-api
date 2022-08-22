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

//* eu ainda vou conseguir fazer um generics pra essas duas funções!!
async function getGenres(genres: string) {
  const genresNames: string[] = JSON.parse(genres);
  if (genresNames.length === 0) throw new Error('Nenhum gênero foi enviado');
  const filteredGenres = filterDuplicateNames(genresNames);

  const genresArray: Genre[] = [];
  for (const genreName of filteredGenres) {
    const genre = await Genre.findOne({ where: { name: genreName } });
    if (!genre) throw new Error(`Gênero '${genreName}' inexistente!`);
    genresArray.push(genre);
  }

  return genresArray;
}

async function getAuthors(userSession: UserSession, colaborators?: string) {
  const colaboratorsSlugs: string[] = colaborators ? JSON.parse(colaborators) : [];
  const authors = [...colaboratorsSlugs, userSession.username];
  const filteredAuthors = filterDuplicateNames(authors);

  const profiles: Profile[] = [];
  for (const authorSlug of filteredAuthors) {
    const profile = await Profile.findOne({ where: { slug: authorSlug } });
    if (!profile) throw new Error(`Autor '${authorSlug}' inexistente!`);
    profiles.push(profile);
  }

  return profiles;
}

async function setAlbum(albumSlug: string | undefined, song: Song) {
  if (albumSlug) {
    const foundAlbum = await Album.findOne({ where: { slug: albumSlug } });
    if (!foundAlbum) {
      /* como a música já foi criada e houve um erro, ela é deletada. O ideal seria nem ter criado a música.
      Essa foi a forma mais prática que encontrei, mas é algo a ser revisto.*/
      song.destroy(); //TODO
      throw new Error('álbum inexistente!');
    }
    await song.setAlbum(foundAlbum);
    return foundAlbum;
  } else {
    return await song.createAlbum({ name: song.name, slug: slugGen(), single: true });
  }
}

interface RequestBody {
  name: string;
  genres: string; //* array de gêneros (pelo menos um gênero)
  albumSlug?: string;
  colaborators?: string; //* colaborators será um array com os usernames dos colaboradores
}

const upload = multer(songs).single('song');

export async function store(req: CustomRequest<RequestBody>, res: Response): Promise<void> {
  return upload(req, res, async (error): Promise<Response> => {
    if (error instanceof MulterError) {
      return res.status(400).json({ errors: [error.field] });
    } else if (error) {
      return res.status(400).json({ errors: error });
    }

    try {
      const userSession = req.session.user as UserSession;

      const { name, albumSlug, colaborators, genres } = req.body;
      if (!name) return res.status(400).json({ error: ['Nome da música não enviado'] });
      if (!genres) return res.status(400).json({ error: ['Nenhum gênero foi enviado'] });

      const genresArray = await getGenres(genres);
      const profiles = await getAuthors(userSession, colaborators);

      if (!req.file) {
        return res.status(400).json({ errors: ['Nenhuma música enviada!!'] });
      }

      const filepath = `http://localhost:3001/uploads/songs/${req.file.filename}`;

      const song = await Song.create({ name, filename: filepath, slug: slugGen() });

      song.setProfiles(profiles);
      song.setGenres(genresArray);

      const album = await setAlbum(albumSlug, song);

      const songGenres = (await song.getGenres()).map((genre) => genre.name);
      const songAuthors = (await song.getProfiles()).map((profile) => profile.slug);

      return res.status(200).json({ song, genres: songGenres, authors: songAuthors, album: album.name });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ errors: error.errors.map((err) => err.message) });
      }

      if (error instanceof Error) {
        return res.status(400).json({ errors: [error.message] });
      }

      return res.status(500).json({ errors: ['Erro desconhecido'] });
    }
  });
}
