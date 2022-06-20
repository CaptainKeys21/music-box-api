import { Request, Response } from "express";
import { BaseError, Sequelize, ValidationError } from 'sequelize'
import User from "../models/User.model";

class UserController {
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const newUser = await User.create(req.body);
      return res.status(200).json(newUser.id);
    } catch (e) {
      if(e instanceof ValidationError){
        return res.status(400).json({
          errors: e.errors.map(err => err.message),
        });
      }
      return res.status(400).json({
        errors: ['Erro Desconhecido']
      })
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findByPk(req.params.id);

      if(!user) {
        return res.status(400).json({
          errors: ['Usuário não existe']
        });
      }

      return res.status(200).json({user})

    } catch (e) {
      return res.status(400).json({
        errors: ['Usuário não existe']
      });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findByPk(req.params.id);

      if(!user) {
        return res.status(400).json({
          errors: ['Usuário não existe']
        });
      }

      const newData = await user.update(req.body);
      const {id, username, email} = newData;

      return res.json({id, username, email});
    } catch (e) {
      return res.status(400).json({
        errors: ['Usuário não existe']
      });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findByPk(req.params.id);

      if(!user) {
        return res.status(400).json({
          errors: ['Usuário não existe']
        });
      }

      await user.destroy();

      return res.status(200).json(null);
    } catch (e) {
      return res.status(400).json({
        errors: ['Usuário não existe'],
      });
    }
  }
}

export default new UserController();
