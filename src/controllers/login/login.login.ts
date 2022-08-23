import { Response } from 'express';
import { Op } from 'sequelize';
import { ValidationError } from 'sequelize';
import User from '../../models/User.model';
import { CustomRequest } from '../../types/music-box';

interface RequestBody {
  login: string;
  password: string;
}

export async function login(req: CustomRequest<RequestBody>, res: Response): Promise<Response> {
  try {
    const { login, password } = req.body; //* login nesse caso será o email ou username.

    const errors: Error[] = [];

    if (!login) errors.push(new Error('login não pode ser vazio'));
    if (!password) errors.push(new Error('senha não pode ser vazia'));

    if (errors.length > 0) {
      return res.status(404).json({ error: errors.map((error) => error.message) });
    }

    //* encontra no banco se o email ou o username forem iguais ao login enviado.
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: login }, { username: login }],
      },
    });

    if (!user || !user.passwordIsValid(password)) {
      return res.status(401).json({ error: ['usuário ou senha inválidos'] });
    }

    const { email, username } = user;
    const { id } = await user.getProfile();

    req.session.user = { email, username, profileId: id };
    req.session.loggedIn = true;
    user.updateLastLogin();

    return res.status(200).json({ message: 'usuário logado!', user: req.session.user });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ errors: error.errors.map((err) => err.message) });
    }
    return res.status(500).json({ errors: ['Erro Desconhecido'] });
  }
}
