import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.loggedIn) {
    return res.status(401).json({ errors: ['Usuário não logado'] });
  }
  return next();
};
