import { Router } from 'express'
import { AuthController } from './AuthController.ts'
import { AuthMiddle } from '../../../middlewares/AuthMiddle.ts'

const AuthRouter = Router()

const authController = new AuthController()

/**
 * @openapi
 * /auth/me:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retorna informações do usuário autenticado
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Informações da sua conta recuperadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 */
AuthRouter.get(
  '/auth/me',
  AuthMiddle,
  authController.me,
)

/**
 * @openapi
 * /auth:
 *   post:
 *     summary: Realiza login e retorna o token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *       401:
 *         description: Credenciais inválidas
 */
AuthRouter.post(
  '/auth',
  authController.login,
)

AuthRouter.patch(
  '/auth/change-password',
  AuthMiddle,
  authController.changePassword,
)

export { AuthRouter }
