import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import Profile from '../models/Profile.model';

class ProfileController {
  // * Provavelmente não será usado
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const newProfile = await Profile.create(req.body);
      return res.status(201).json(newProfile);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ errors: error.errors.map((err) => err.message) });
      }
      return res.status(500).json({ errors: ['Erro desconhecido'] });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const profile = await Profile.findOne({ where: { slug: req.params.slug } });
      if (!profile) {
        return res.status(404).json({ errors: ['Usuário não encontrado'] });
      }

      return res.status(200).json({ profile });
    } catch (error) {
      return res.status(500).json({ errors: ['Erro Desconhecido'] });
    }
  }

  //! apenas para testes
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const profiles = await Profile.findAll();

      return res.status(200).json(profiles);
    } catch (error) {
      return res.status(500).json({ errors: ['erro'] });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const userSession = req.session.user as UserSession;

      const profile = await Profile.findBySession(userSession);
      if (!profile) return res.status(404).json({ errors: ['Perfil não encontrado'] });

      const updatedProfile = await profile.update({
        slug: req.body.slug,
        profileName: req.body.profileName,
        bio: req.body.bio,
        imageUrl: req.body.imageUrl,
        local: req.body.local,
        website: req.body.website,
      });

      return res.status(200).json({ updatedProfile });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ errors: error.errors.map((err) => err.message) });
      }
      return res.status(500).json({ errors: ['Erro desconhecido'] });
    }
  }
}

export default new ProfileController();
