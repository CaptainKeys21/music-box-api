import { Request, Response } from 'express';
import { ValidationError } from 'sequelize';
import Article from '../models/Article.model';

class ArticleController {
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const userSession = req.session.user as UserSession;

      const newArticle = await Article.create({
        slug: req.body.title.replace(/\s/g, '-'),
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
      });

      newArticle.addProfiles([userSession.profileId]);

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
      const article = await Article.findOne({
        where: { slug: req.params.aSlug },
        include: {
          association: 'Profiles', //* Se for usar strings, tem que ser o nome da base no PSQL
          where: { slug: req.params.pSlug },
        },
      });

      if (!article) return res.status(404).json({ errors: ['Artigo não encontrado'] });

      return res.status(200).json(article);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errors: ['Erro desconhecido'] });
    }
  }

  // * Na verdade vamos usar sim
  async index(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.params.pSlug) {
        const articles = await Article.findAll({ include: 'Profiles' });
        if (!articles) return res.status(404).json({ errors: ['Nenhum artigo foi encontrado'] });
        return res.status(200).json(articles);
      } else {
        const articles = await Article.findAll({
          include: {
            association: 'Profiles', //* Se for usar strings, tem que ser o nome da base no PSQL
            where: { slug: req.params.pSlug },
          },
        });
        if (!articles) return res.status(404).json({ errors: ['Nenhum artigo foi encontrado'] });
        return res.status(200).json(articles);
      }
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
