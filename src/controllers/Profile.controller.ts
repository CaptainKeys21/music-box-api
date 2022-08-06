import { Request, Response } from 'express';
import { unlinkSync } from 'fs';
import multer, { MulterError } from 'multer';
import { resolve } from 'path';
import { ValidationError } from 'sequelize';
import { profileImage } from '../configs/multer';
import Profile from '../models/Profile.model';

const upload = multer(profileImage).single('imageUrl');

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

  async update(req: Request, res: Response): Promise<void> {
    return upload(req, res, async (error): Promise<Response> => {
      if (error instanceof MulterError) {
        return res.status(400).json({ errors: [error.field] });
      } else if (error) {
        return res.status(400).json({ errors: error });
      }

      try {
        const userSession = req.session.user as UserSession;

        const profile = await Profile.findBySession(userSession);
        if (!profile) return res.status(404).json({ errors: ['Perfil não encontrado'] });

        const filepath = req.file ? `http://localhost:3001/uploads/images/${req.file.filename}` : profile.imageUrl;
        const { slug, profileName, bio, local, website } = req.body;

        //! remove o arquivo da foto anterior caso a foto seja alterada, isso será removido
        if (req.file && profile.imageUrl) {
          const fileToDelete = profile.imageUrl.split('images/')[1];
          unlinkSync(resolve(__dirname, '..', '..', 'static', 'uploads', 'images', fileToDelete));
        }

        const updatedProfile = await profile.update({
          slug,
          profileName,
          bio,
          imageUrl: filepath,
          local,
          website,
        });

        return res.status(200).json({ updatedProfile });
      } catch (error) {
        if (error instanceof ValidationError) {
          return res.status(400).json({ errors: error.errors.map((err) => err.message) });
        }
        console.log(error);
        return res.status(500).json({ errors: ['Erro desconhecido'] });
      }
    });
  }
}

export default new ProfileController();
