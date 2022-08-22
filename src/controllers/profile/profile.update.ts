import { Response } from 'express';
import { unlinkSync } from 'fs';
import multer, { MulterError } from 'multer';
import { resolve } from 'path';
import { ValidationError } from 'sequelize';
import { profileImage } from '../../configs/multer';
import Profile from '../../models/Profile.model';
import { CustomRequest, UserSession } from '../../types/music-box';

interface RequestBody {
  profileName?: string;
  bio?: string;
  local?: string;
  website?: string;
}

const upload = multer(profileImage).single('imageUrl');

export async function update(req: CustomRequest<RequestBody>, res: Response): Promise<void> {
  return upload(req, res, async (error): Promise<Response> => {
    if (error instanceof MulterError) {
      return res.status(400).json({ errors: [error.field] });
    } else if (error) {
      return res.status(400).json({ errors: error });
    }

    try {
      const { profileName, bio, local, website } = req.body;

      const userSession = req.session.user as UserSession;
      const profile = await Profile.findBySession(userSession);
      if (!profile) return res.status(404).json({ errors: ['Perfil não encontrado'] });

      const filepath = req.file ? `http://localhost:3001/uploads/images/${req.file.filename}` : profile.imageUrl;

      //! remove o arquivo da foto anterior caso a foto seja alterada, isso será removido
      if (req.file && profile.imageUrl) {
        const fileToDelete = profile.imageUrl.split('images/')[1];
        try {
          unlinkSync(resolve(__dirname, '..', '..', 'static', 'uploads', 'images', fileToDelete));
        } catch (error) {
          //
        }
      }

      const updatedProfile = await profile.update({
        profileName,
        imageUrl: filepath,
        bio: bio || null,
        local: local || null,
        website: website || null,
      });

      return res.status(200).json({ updatedProfile });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ errors: error.errors.map((err) => err.message) });
      }
      return res.status(500).json({ errors: ['Erro desconhecido'] });
    }
  });
}
