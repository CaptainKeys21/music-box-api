import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import User from '../models/User.model';

class UserController {
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const newUser = await User.create(req.body);
      return res.status(200).json(newUser);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ errors: error.errors.map((err) => err.message) });
      }
      return res.status(400).json({ errors: ['Erro Desconhecido'] });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(400).json({ errors: ['Usuário não existe'] });
      }

      return res.status(200).json({ user });
    } catch (error) {
      return res.status(400).json({ errors: ['Usuário não existe'] });
    }
  }

  //! apenas para testes
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.findAll();

      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ errors: ['erro'] });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const userSession = req.session.user;
      const user = await User.findOne({ where: { email: userSession?.email } }); //? tenho minhas dúvidas se usar o operador "?" é uma boa prática.

      if (!user) {
        return res.status(400).json({ errors: ['Usuário não existe'] });
      }

      const newData = await user.update(req.body);
      const { id, username, email } = newData;

      req.session.user = { username, email };

      return res.json({ id, username, email });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ errors: error.errors.map((err) => err.message) });
      }
      return res.status(400).json({ errors: ['Erro Desconhecido'] });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const userSession = req.session.user;
      const user = await User.findOne({ where: { email: userSession?.email } });

      if (!user) {
        return res.status(400).json({ errors: ['Usuário não existe'] });
      }

      await user.destroy();
      req.session.destroy((err) => err); //* em vez de destroy() poderia apenas definir a session.user como null.

      return res.status(200).json({ success: 'Usuário deletado' });
    } catch (error) {
      return res.status(400).json({ errors: ['Usuário não existe'] });
    }
  }
}

export default new UserController();
