// @deno-types='npm:@types/express'
import { Router } from 'npm:express'
import { UserRouter as Routes } from '../features/user/UserRouter.ts'

const UserRouter = Router()

UserRouter.use(Routes)

export { UserRouter }
