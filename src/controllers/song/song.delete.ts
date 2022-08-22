import { Request, Response } from 'express';
import Song from '../../models/Song.model';
import { UserSession } from '../../types/music-box';

export async function songDelete(req: Request, res: Response): Promise<Response> {
  try {
    const userSession = req.session.user as UserSession;
    const song = await Song.findOne({ where: { slug: req.params.slug } });

    if (!song) {
      return res.status(400).json({ errors: ['Música não encontrada'] });
    }

    const profiles = await song.getProfiles();
    const profilesIds = profiles.map((profile) => profile.id);

    if (!profilesIds.includes(userSession.profileId)) {
      return res.status(401).json({ errors: ['Acesso Negado'] });
    }

    await song.destroy();
    return res.status(200).json({ message: 'Música excluída com sucesso' });
  } catch (error) {
    return res.status(500).json({ errors: ['Erro Desconhecido'] });
  }
}
