// @deno-types='npm:@types/express'
import { Router } from 'npm:express'
import { UserRouter } from '../features/auth/Authenticate/UserRouter.ts'


const AuthRouter = Router()

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns OK.
 */
AuthRouter.use(UserRouter)

export { AuthRouter }
