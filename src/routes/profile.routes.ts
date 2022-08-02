import { Router } from 'express';
import ProfileController from '../controllers/Profile.controller';
import loginRequired from '../middlewares/loginRequired';

const router: Router = Router();

router.get('/', ProfileController.index);
router.get('/:slug', ProfileController.show);
router.put('/', loginRequired, ProfileController.update);
//router.post('/', ProfileController.store);

export default router;
