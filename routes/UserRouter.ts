// @deno-types='npm:@types/express'
import { Router } from 'npm:express'
import { UserRouter as Routes } from '../features/api/user/UserRouter.ts'

const UserRouter = Router()

UserRouter.use(Routes)

export { UserRouter }
