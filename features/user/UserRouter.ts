import { Router } from 'express';
import { AuthMiddle } from '../../middlewares/AuthMiddle.ts'
import { UserController } from './controllers/UserController.ts'
import { PaginationMiddle } from '../../middlewares/PaginationMiddle.ts'

const UserRouter = Router();

const userController = new UserController();

UserRouter.get(
    '/api/users/',
    AuthMiddle,
    PaginationMiddle({maxLimit : 10}),
    userController.findAll
)

UserRouter.get(
    '/api/users/:id',
    AuthMiddle,
    userController.findById
)

UserRouter.post(
    '/api/users',
    userController.register
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
