// @deno-types='npm:@types/express'
import { Router } from 'npm:express'
import { AuthRouter as Routes } from '../features/api/auth/AuthRouter.ts'

const AuthRouter = Router()

AuthRouter.use(Routes)

export { AuthRouter }
