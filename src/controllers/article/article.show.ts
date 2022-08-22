import { Request, Response } from 'express';
import Article from '../../models/Article.model';

export async function show(req: Request, res: Response): Promise<Response> {
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
