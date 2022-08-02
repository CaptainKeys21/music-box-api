import { Response, Request } from 'express';
import User from '../models/User.model';
import { Op, ValidationError } from 'sequelize';

class LoginController {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { login = '', password = '' } = req.body; //* login nesse caso será o email ou username.

      if (!login) return res.status(400).json({ error: ['login não pode ser vazio'] });
      if (!password) return res.status(400).json({ error: ['senha não pode ser vazia'] });

      //* encontra no banco se o email ou o username forem iguais ao login enviado.
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: login }, { username: login }],
        },
      });

      if (!user) return res.status(404).json({ error: ['usuário inexistente'] });

      if (!user.passwordIsValid(password)) {
        return res.status(401).json({ error: ['senha inválida'] });
      }

      const { email, username } = user;
      req.session.user = { email, username };
      req.session.loggedIn = true;
      user.updateLastLogin();

      return res.status(200).json({ message: 'user logged in', user: req.session.user });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ errors: error.errors.map((err) => err.message) });
      }
      return res.status(500).json({ errors: ['Erro Desconhecido'] });
    }
  }

  logout(req: Request, res: Response): Response {
    req.session.destroy((err) => err); //* em vez de destroy() poderia apenas definir a session.user como null.
    return res.status(200).json('usuário deslogado');
  }
}

export default new LoginController();
