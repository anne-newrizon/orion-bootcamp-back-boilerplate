import { Router } from 'express';
import { HomeController } from './controllers/HomeController';
import { UsersController } from './controllers/UsersController';
import { UsersValidator } from './validators/UserValidator';
import authMiddleware from './middlewares/authMiddleware';

const router = Router();

router.get('/', new HomeController().hello);
router.post(
  '/users/login',
  new UsersValidator().loginValidate(),
  new UsersController().login
);
router.get('/users/logged', authMiddleware, new UsersController().loggedUser);

export default router;
