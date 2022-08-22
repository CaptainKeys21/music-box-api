import { Request, Response } from 'express';
import Article from '../../models/Article.model';

export async function index(req: Request, res: Response): Promise<Response> {
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
