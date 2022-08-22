import { Request, Response } from 'express';

export function logout(req: Request, res: Response): Response {
  req.session.destroy((err) => err); //* em vez de destroy() poderia apenas definir a session.user como null.
  return res.status(200).json('usuário deslogado');
}
