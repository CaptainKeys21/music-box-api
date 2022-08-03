import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import Article from '../models/Article.model';

class ArticleController {
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const userSession = req.session.user;
      const profileSession = req.session.profile;

      if (!userSession || !profileSession) return res.status(401).json({ errors: ['acesso negado'] });

      const newArticle = await Article.create({
        slug: req.body.title.replace(/\s/g, '-'),
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
      });

      newArticle.addProfiles([profileSession.id]);

      return res.status(201).json(newArticle);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ errors: error.errors.map((err) => err.message) });
      }
      return res.status(500).json({ errors: ['Erro Desconhecido'] });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      return res.json(req.params);
    } catch (error) {
      return res.status(500).json({ errors: ['Erro desconhecido'] });
    }
  }

  // * Provavelmente não será usado posteriormente
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const articles = await Article.findAll();

      if (!articles) return res.status(404).json({ errors: ['Nenhum artigo foi encontrado'] });

      return res.status(200).json(articles);
    } catch (error) {
      return res.status(500).json({ errors: ['Erro desconhecido'] });
    }
  }

  // async update(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const userSession = req.session.user;
  //     if (!userSession) {
  //       return res.status(401).json({ errors: ['Usuário não está logado'] });
  //     }
  //   } catch (error) {}
  // }
}

export default new ArticleController();
