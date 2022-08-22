import { Router } from 'express';
import loginRequired from '../../middlewares/loginRequired';
import { userDelete } from './user.delete';
import { index } from './user.index';
import { show } from './user.show';
import { store } from './user.store';
import { update } from './user.update';

const router: Router = Router();

router.get('/:id', show);
router.post('/', store);
router.get('/', index); //! apenas para testes
router.put('/', loginRequired, update);
router.delete('/', loginRequired, userDelete);

export default router;
