import { Request, Response } from 'express';
import { ValidationError } from 'sequelize/types';
import Article from '../models/Article.model';

class ArticleController {
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const newArticle = await Article.create(req.body);
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
      const article = await Article.findOne({ where: { slug: req.params.slug } });

      if (!article) {
        return res.status(404).json({ errors: ['Artigo não encontrado'] });
      }

      return res.status(200).json({ article });
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

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        return res.status(401).json({ errors: ['Usuário não está logado'] });
      }
    } catch (error) {}
  }
}

export default new ArticleController();
