import { Request, Response } from 'express';
import User from '../../models/User.model';
import { UserSession } from '../../types/music-box';

// TODO essa rota vai excluir também os álbuns e playlists. Mas vou esperar quando for fazer os controllers de ambos.
export async function userDelete(req: Request, res: Response): Promise<Response> {
  try {
    const userSession = req.session.user as UserSession;
    const user = await User.findOne({ where: { email: userSession.email } });

    if (!user) {
      return res.status(404).json({ errors: ['Usuário não encontrado'] });
    }

    const profile = await user.getProfile();
    const songs = await profile.getSongs();

    for (const song of songs) {
      const songProfiles = await song.getProfiles();
      if (songProfiles.length === 1) await song.destroy();
    }

    await user.destroy();
    req.session.destroy((err) => err);

    return res.status(200).json({ success: 'Usuário deletado' });
  } catch (error) {
    return res.status(500).json({ errors: ['Erro desconhecindo'] });
  }
}
