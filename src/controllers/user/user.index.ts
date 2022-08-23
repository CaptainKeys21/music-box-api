import { Request, Response } from 'express';
import User from '../../models/User.model';

//! apenas para testes
export async function index(req: Request, res: Response): Promise<Response> {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ errors: ['erro'] });
  }
}
