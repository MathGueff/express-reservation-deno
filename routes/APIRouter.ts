// @deno-types='npm:@types/express'
import { Request, Response, Router } from 'npm:express'

const APIRouter = Router()

APIRouter.get('/api/status', (_req: Request, res: Response) => {
  return res.send('Api OK')
})

export { APIRouter }
