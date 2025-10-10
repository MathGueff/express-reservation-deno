import { Env } from '../config/Env.ts'
import { UserRouter } from '../features/auth/User/UserRouter.ts'
import { Responserror } from '../middlewares/ResponseerorMiddle.ts'
import { APIRouter } from '../routes/APIRouter.ts'
import { AbstractEnvironment } from './AbstractEnvironment.ts'
import express from 'npm:express'

export class ApiEnvironment extends AbstractEnvironment {
  constructor() {
    const port = Env.isRunningLocally ? 7001 : 8000
    super(port)
  }

  public run = () => {
    const apiServer = express()

    this.initializeDefaultMiddlewares(apiServer)

    apiServer.use(APIRouter)
    apiServer.use(UserRouter)

    const r = new Responserror
    apiServer.use(r.errorHandler)

    this.listen(apiServer)
  }
}
