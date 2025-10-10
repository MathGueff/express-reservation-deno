import {Router} from 'express'
import { UserController, } from './controllers/UserController.ts'
import { AuthMiddle } from '../../../middlewares/AuthMiddle.ts'

const UserRouter = Router();

// TODO: Adicionar controller
const userController = new UserController();

UserRouter.get(
    '/api/auth/me',
    AuthMiddle,
    userController.me
)

UserRouter.post(
    '/api/auth',
    userController.login
)

UserRouter.post(
    '/api/register',
    userController.create
)

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *      - Usuário
 *     description: Retorna o usuário com o ID fornecido
 *     responses:
 *       200:
 *         description: Retorna usuário
 *       400:
 *         description: Retorna erro de formato
 *       404
 *         description: Retorna usuário não encontrado
 */
UserRouter.get(
    '/api/users/:id',
    AuthMiddle,
    userController.findById
)

UserRouter.put(
    '/api/users/:id',
    AuthMiddle,
    userController.update
)

UserRouter.delete(
    '/api/users/:id',
    AuthMiddle,
    userController.delete
)

export {UserRouter}