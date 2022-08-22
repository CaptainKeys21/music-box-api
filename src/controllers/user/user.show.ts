import { Request, Response } from 'express';
import User from '../../models/User.model';

export async function show(req: Request, res: Response): Promise<Response> {
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
