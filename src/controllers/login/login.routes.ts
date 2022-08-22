import { Router } from 'express';
import { login } from './login.login';
import { logout } from './login.logout';

const router: Router = Router();

router.post('/', login);
router.delete('/', logout);

export default router;
