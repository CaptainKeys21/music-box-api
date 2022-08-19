//!! ESSE ARQUIVO PROVAVELMENTE SERÁ APAGADO NA PRODUÇÃO
import { Router } from 'express';
import GenreController from '../controllers/Genre.controller';
const router: Router = Router();

router.get('/', GenreController.store);

export default router;
