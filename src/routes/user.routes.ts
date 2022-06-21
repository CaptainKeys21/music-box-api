import { Router } from 'express';
import UserController from '../controllers/User.controller';

const router: Router = Router();

router.get('/:id', UserController.show);
router.get('/', UserController.index); //! apenas para testes
router.post('/', UserController.store);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router;
