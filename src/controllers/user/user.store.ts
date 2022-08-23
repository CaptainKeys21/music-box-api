import { Response } from 'express';
import { ValidationError } from 'sequelize';
import User from '../../models/User.model';
import { CustomRequest } from '../../types/music-box';
import { slugGen } from '../../utils/slugGen';

interface RequestBody {
  username: string;
  email: string;
  password: string;
}

export async function store(req: CustomRequest<RequestBody>, res: Response): Promise<Response> {
  try {
    const { username, email, password } = req.body;

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
