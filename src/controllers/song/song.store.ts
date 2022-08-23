import { Response } from 'express';
import multer, { MulterError } from 'multer';
import { ValidationError } from 'sequelize';
import { songs } from '../../configs/multer';
import Album from '../../models/Album.model';
import Genre from '../../models/Genre.model';
import Profile from '../../models/Profile.model';
import Song from '../../models/Song.model';
import { CustomRequest, UserSession } from '../../types/music-box';
import { filterDuplicateElements } from '../../utils/filterDuplicateElements';
import { slugGen } from '../../utils/slugGen';

interface RequestBody {
  name: string;
  genres: string; //* array de gêneros (pelo menos um gênero)
  albumSlug?: string;
  colaborators?: string; //* array com os slugs dos colaboradores
}

async function setAlbum(albumSlug: string | undefined, song: Song) {
  if (albumSlug) {
    const album = await Album.findOne({ where: { slug: albumSlug } });
    if (!album) {
      /* como a música já foi criada e houve um erro, ela é deletada. O ideal seria nem ter criado a música.
      Essa foi a forma mais prática que encontrei, mas é algo a ser revisto.*/
      song.destroy(); //TODO
      throw new Error('álbum inexistente!');
    }
    await song.setAlbum(album);
    return album;
  } else {
    return await song.createAlbum({ name: song.name, slug: slugGen(), single: true });
  }
}

async function getGenres(genresJSON: string) {
  const genresNames: string[] = genresJSON ? JSON.parse(genresJSON) : [];
  if (genresNames.length === 0) throw new Error('Nenhum gênero foi enviado');
  const filteredGenres = filterDuplicateElements(genresNames);
  return await Genre.getGenresByNames(filteredGenres);
}

async function getAuthors(colaborators: string | undefined, creatorSlug: string) {
  const profilesSlugs: string[] = colaborators ? JSON.parse(colaborators) : [];
  profilesSlugs.push(creatorSlug);
  const filteredAuthors = filterDuplicateElements(profilesSlugs);
  return await Profile.getProfilesBySlugs(filteredAuthors);
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

      const userProfile = await Profile.findBySession(userSession);
      if (!userProfile) return res.status(400).json({ errors: ['Perfil não encontrado'] });

      if (!req.file) return res.status(400).json({ errors: ['Nenhuma música enviada!!'] });

      const filepath = `http://localhost:3001/uploads/songs/${req.file.filename}`;

      const genresArray = await getGenres(genres);
      const authors = await getAuthors(colaborators, userProfile.slug);

      const song = await Song.create({ name, filename: filepath, slug: slugGen() });

      song.setProfiles(authors);
      song.setGenres(genresArray);

      const album = await setAlbum(albumSlug, song);
      const songGenres = (await song.getGenres()).map((genre) => genre.name);
      const songAuthors = (await song.getProfiles()).map((profile) => profile.slug);

      return res.status(200).json({ song, genres: songGenres, authors: songAuthors, album: album.name });
    } catch (error) {
      if (error) {
        if (error instanceof ValidationError) {
          return res.status(400).json({ errors: error.errors.map((err) => err.message) });
        }
        if (error instanceof Error) {
          return res.status(400).json({ errors: [error.message] });
        }
        return res.status(400).json({ errors: error });
      }
      return res.status(500).json({ errors: ['Erro desconhecido'] });
    }
  });
}
