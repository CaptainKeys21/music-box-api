import { Request, Response } from 'express';
import Profile from '../../models/Profile.model';

export async function show(req: Request, res: Response): Promise<Response> {
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
