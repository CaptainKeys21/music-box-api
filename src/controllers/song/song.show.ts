import { Request, Response } from 'express';
import Song from '../../models/Song.model';

export async function show(req: Request, res: Response): Promise<Response> {
  try {
    const song = await Song.findOne({ where: { slug: req.params.slug } });
    if (!song) {
      return res.status(400).json({ errors: ['Música não encontrada'] });
    }
    const authors = (await song.getProfiles()).map((author) => author.slug);
    const genres = (await song.getGenres()).map((genre) => genre.name);

    return res.status(200).json({ song, authors, genres });
  } catch (error) {
    return res.status(500).json({ errors: ['Erro Desconhecido'] });
  }
}
