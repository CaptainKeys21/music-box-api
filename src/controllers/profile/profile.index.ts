import { Request, Response } from 'express';
import Profile from '../../models/Profile.model';

//! apenas para testes
export async function index(req: Request, res: Response): Promise<Response> {
  try {
    const profiles = await Profile.findAll();
    return res.status(200).json(profiles);
  } catch (error) {
    return res.status(500).json({ errors: ['erro'] });
  }
}
