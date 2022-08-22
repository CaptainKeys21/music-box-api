import { Response } from 'express';
import { ValidationError } from 'sequelize';
import User from '../../models/User.model';
import { CustomRequest } from '../../types/music-box';
import { slugGen } from '../../utils/slugGen';

interface StoreRequestBody {
  username: string;
  email: string;
  password: string;
}

export async function store(req: CustomRequest<StoreRequestBody>, res: Response): Promise<Response> {
  try {
    const { username, email, password } = req.body;

    if (!username) return res.status(400).json({ error: ['username não enviado'] });
    if (!email) return res.status(400).json({ error: ['email não enviado'] });
    if (!password) return res.status(400).json({ error: ['senha não enviada'] });

    const newUser = await User.create({ username, email, password });
    const newProfile = await newUser.createProfile({ slug: req.body.username, profileName: req.body.username });
    const favoritePlaylist = await newProfile.createPlaylist({ name: 'Favorites', slug: slugGen() });

    return res.status(201).json({ user: newUser, profile: newProfile, favoritePlaylist });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ errors: error.errors.map((err) => err.message) });
    }
    return res.status(500).json({ errors: ['Erro Desconhecido'] });
  }
}
