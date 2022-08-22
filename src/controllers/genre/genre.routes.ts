//!! ESSE ARQUIVO PROVAVELMENTE SERÁ APAGADO NA PRODUÇÃO
import { Router } from 'express';
import { store } from './genre.store';
const router: Router = Router();

router.get('/', store);

export default router;
