import {Router} from 'express'
import { AuthController } from './controllers/AuthController.ts'
import { AuthMiddle } from '../../middlewares/AuthMiddle.ts'

const AuthRouter = Router();

const authController = new AuthController();

AuthRouter.get(
    '/api/auth/me',
    AuthMiddle,
    authController.me
)

AuthRouter.post(
    '/api/auth',
    authController.login
)

export {AuthRouter}