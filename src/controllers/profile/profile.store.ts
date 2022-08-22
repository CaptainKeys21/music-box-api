import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import Profile from '../../models/Profile.model';

// * Provavelmente não será usado
export async function store(req: Request, res: Response): Promise<Response> {
  try {
    const newProfile = await Profile.create(req.body);
    return res.status(201).json(newProfile);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ errors: error.errors.map((err) => err.message) });
    }
    return res.status(500).json({ errors: ['Erro desconhecido'] });
  }
}
