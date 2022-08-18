import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import User from '../models/User.model';
import { CustomRequest, UserSession } from '../types/music-box';
import { slugGen } from '../utils/slugGen';

interface StoreRequestBody {
  username: string;
  email: string;
  password: string;
}

interface UpdateRequestBody {
  username?: string;
  email?: string;
}

class UserController {
  async store(req: CustomRequest<StoreRequestBody>, res: Response): Promise<Response> {
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

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ errors: ['Usuário não encontrado'] });
      }

      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ errors: ['Erro Desconhecido'] });
    }
  }

  //! apenas para testes
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.findAll();

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ errors: ['erro'] });
    }
  }

  async update(req: CustomRequest<UpdateRequestBody>, res: Response): Promise<Response> {
    try {
      const userSession = req.session.user as UserSession;
      const user = await User.findOne({ where: { email: userSession.email } });

      if (!user) {
        return res.status(404).json({ errors: ['Usuário não encontrado'] });
      }

      const { username: sentUsername, email: sentEmail } = req.body;
      const { username, email, id } = await user.update({ username: sentUsername, email: sentEmail });

      req.session.user = { username, email, profileId: userSession.profileId };

      return res.json({ id, username, email });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ errors: error.errors.map((err) => err.message) });
      }
      return res.status(500).json({ errors: ['Erro Desconhecido'] });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const userSession = req.session.user as UserSession;
      const user = await User.findOne({ where: { email: userSession.email } });

      if (!user) {
        return res.status(404).json({ errors: ['Usuário não encontrado'] });
      }

      await user.destroy();
      req.session.destroy((err) => err);

      return res.status(200).json({ success: 'Usuário deletado' });
    } catch (error) {
      return res.status(500).json({ errors: ['Erro desconhecindo'] });
    }
  }
}

export default new UserController();
