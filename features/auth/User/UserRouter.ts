import {Router} from 'express'
import { UserController, } from './controllers/UserController.ts'

const UserRouter = Router();

// TODO: Adicionar controller
const userController = new UserController();

UserRouter.get(
    '/api/user',
    //middleware
    userController.update
)

UserRouter.put(
    '/api/user/:id',
    //middleware
    userController.update
)

UserRouter.delete(
    '/api/user',
    //middleware
    userController.update
)

export {UserRouter}