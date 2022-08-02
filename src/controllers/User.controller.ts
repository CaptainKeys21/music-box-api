import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import User from '../models/User.model';

class UserController {
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      const newProfile = await newUser.createProfile({ slug: req.body.username });
      return res.status(201).json({ user: newUser, profile: newProfile });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ errors: error.errors.map((err) => err.message) });
      }
      return res.status(500).json({ errors: ['Erro Desconhecido'] });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
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

  //! apenas para testes
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.findAll();

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ errors: ['erro'] });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const userSession = req.session.user;

      if (!userSession) {
        // * 401 = Não autorizado
        return res.status(401).json({ errors: ['Acesso Negado'] }); // * agora o objeto não tem como ser undefined ou null após esse if
      }

      const user = await User.findOne({ where: { email: userSession.email } });

      if (!user) {
        return res.status(404).json({ errors: ['Usuário não encontrado'] });
      }

      const newData = await user.update(req.body);
      const { id, username, email } = newData;

      req.session.user = { username, email };

      return res.json({ id, username, email });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ errors: error.errors.map((err) => err.message) });
      }
      return res.status(500).json({ errors: ['Erro Desconhecido'] });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const userSession = req.session.user;

      if (!userSession) {
        // * 401 = Não autorizado
        return res.status(401).json({ errors: ['Acesso Negado'] }); // * agora o objeto não tem como ser undefined ou null após esse if
      }

      const user = await User.findOne({ where: { email: userSession.email } });

      if (!user) {
        return res.status(404).json({ errors: ['Usuário não encontrado'] });
      }

      await user.destroy();
      req.session.destroy((err) => err); //* em vez de destroy() poderia apenas definir a session.user como null.

      return res.status(200).json({ success: 'Usuário deletado' });
    } catch (error) {
      return res.status(500).json({ errors: ['Erro desconhecindo'] });
    }
  }
}

export default new UserController();
