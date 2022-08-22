import { Request, Response } from 'express';
import Song from '../../models/Song.model';

//* provavelmente não será usado
export async function index(req: Request, res: Response): Promise<Response> {
  try {
    const songs = await Song.findAll();

    return res.status(200).json(songs);
  } catch (error) {
    return res.status(500).json({ errors: ['erro'] });
  }
}
