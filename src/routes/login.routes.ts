import { Router } from 'express';
import LoginController from '../controllers/Login.controller';
import loginRequired from '../middlewares/loginRequired';

const router: Router = Router();

router.post('/', LoginController.login);
router.delete('/', loginRequired, LoginController.logout);

export default router;
