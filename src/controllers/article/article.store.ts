import { Response } from 'express';
import { ValidationError } from 'sequelize';
import Article from '../../models/Article.model';
import { CustomRequest, UserSession } from '../../types/music-box';

interface StoreRequestBody {
  title: string;
  content: string;
  imageUrl: string;
}

export async function store(req: CustomRequest<StoreRequestBody>, res: Response): Promise<Response> {
  try {
    const userSession = req.session.user as UserSession;
    const { content, title, imageUrl } = req.body;

    const newArticle = await Article.create({
      slug: title.replace(/\s/g, '-'),
      title,
      content,
      imageUrl,
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
