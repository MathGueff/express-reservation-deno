import { Env } from '../config/Env.ts'
import { AuthRouter } from '../features/auth/AuthRouter.ts'
import { printMiddle } from '../middlewares/PrintMiddle.ts'
import { Responserror } from '../middlewares/ResponseerorMiddle.ts'
import { APIRouter } from '../routes/APIRouter.ts'
import { UserRouter } from '../routes/UserRouter.ts'
import { AbstractEnvironment } from './AbstractEnvironment.ts'
import express from 'npm:express'

export class ApiEnvironment extends AbstractEnvironment {
  constructor() {
    const port = Env.port;
    super(port)
  }

  public run = () => {
    const apiServer = express()

    this.initializeDefaultMiddlewares(apiServer)

    apiServer.use(APIRouter)
    apiServer.use(AuthRouter)
    apiServer.use(UserRouter)

    const r = new Responserror
    apiServer.use(r.errorHandler)

    this.listen(apiServer)
  }
}
