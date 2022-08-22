import { Response } from 'express';
import { ValidationError } from 'sequelize';
import User from '../../models/User.model';
import { CustomRequest, UserSession } from '../../types/music-box';

interface RequestBody {
  username?: string;
  email?: string;
}

export async function update(req: CustomRequest<RequestBody>, res: Response): Promise<Response> {
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
