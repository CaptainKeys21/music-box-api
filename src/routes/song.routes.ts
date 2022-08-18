import { Router } from 'express';
import SongController from '../controllers/Song.controller';
import loginRequired from '../middlewares/loginRequired';

const router: Router = Router();

router.post('/', loginRequired, SongController.store);

export default router;
