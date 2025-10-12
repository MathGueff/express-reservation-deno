// @deno-types='npm:@types/express'
import { Router } from 'npm:express'
import { UserRouter as Routes } from '../features/user/UserRouter.ts'

const UserRouter = Router()

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns OK.
 */
UserRouter.use(Routes)

export { UserRouter }
