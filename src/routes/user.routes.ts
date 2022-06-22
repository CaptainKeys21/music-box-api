import { Router } from 'express';
import UserController from '../controllers/User.controller';
import loginRequired from '../middlewares/loginRequired';

const router: Router = Router();

router.get('/:id', UserController.show);
router.post('/', UserController.store);
router.get('/', loginRequired, UserController.index); //! apenas para testes
router.put('/', loginRequired, UserController.update);
router.delete('/', loginRequired, UserController.delete);

export default router;
