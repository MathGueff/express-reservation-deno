// @deno-types='npm:@types/express'
import { Request, Response, Router } from 'npm:express'

const APIRouter = Router()

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *      - Server Status
 *     description: Returns server status!
 *     responses:
 *       200:
 *         description: Returns OK.
 */

APIRouter.get('/api/status', (_req: Request, res: Response) => {
  return res.send('Api OK')
})

export { APIRouter }
