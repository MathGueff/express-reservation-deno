import {Router} from 'express'
import { AuthController } from './controllers/AuthController.ts'
import { AuthMiddle } from '../../../middlewares/AuthMiddle.ts'

const AuthRouter = Router();

const authController = new AuthController();

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Retorna informações do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - TokenAuth: []
 *     responses:
 *       200:
 *         description: Usuário autenticado retornado com sucesso
 *       401:
 *         description: Token inválido ou ausente
 */
AuthRouter.get(
    '/auth/me',
    AuthMiddle,
    authController.me
)

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/auth:
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
 *
 */
AuthRouter.post(
    '/auth',
    authController.login
)

export {AuthRouter}