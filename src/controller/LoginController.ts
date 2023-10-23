import { Request, Response } from 'express';
import { validateEmailAndPassword } from '../middlewares/validationMiddleware';
import { userRepository } from '../repositories/userRepository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: Autogenerated ID
 *         email:
 *           type: string
 *           description: Unique email
 *         password:
 *           type: string
 *           description: Strong password (8 chars, min 1 uppercase, lowercase, number, special char)
 *       required:
 *         - email
 *         - password
 *       example:
 *         id: 1
 *         email: teste@teste.com
 *         password: RioDeJan!23
 */

/**
 * @swagger
 * /v1/login:
 *   post:
 *     summary: Route used for users to attempt authentication in the app. The function
 *       is set as static to allow calling it directly from the class, without the need to
 *       instantiate the class. This was used in the file /api/v1/loginRoute.ts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid email and/or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

export class LoginController {
  public static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.status(400).send('E-mail e/ou senha inválidos');
    }

    if (validateEmailAndPassword(email, password)) {
      return res.status(400).json({ message: 'E-mail e/ou senha inválidos' });
    }

    if (password == user.password) {
      return res.status(400).send('E-mail e/ou senha inválidos');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET ?? '', {
      expiresIn: '5h'
    });
    user.acessToken = token;
    await userRepository.save(user);

    const { password: _, ...userLogin } = user;

    return res.json({
      user: userLogin,
      token: token
    });
  }
}
