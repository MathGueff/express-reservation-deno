// @deno-types='npm:@types/express'
import { Router } from 'npm:express'
import { AuthRouter as Routes} from '../features/auth/AuthRouter.ts'

const AuthRouter = Router()

AuthRouter.use(Routes)

export { AuthRouter }
