import express, { Express } from 'npm:express'
import cors from 'npm:cors'
import helmet from 'npm:helmet'
import responser from 'responser'
import morgan from 'morgan'

export abstract class AbstractEnvironment {
  public port: number

  constructor(port: number) {
    this.port = port
  }

  protected initializeDefaultMiddlewares(server: Express): void {
    server.use(cors())

    server.use(helmet())

    server.use(responser.default)

    server.use(express.json())

    server.use(express.urlencoded({ extended: true }))

    server.use(express.static('public'))

    server.use(morgan(':method :url | StatusCode :status | :res[content-length]'))
    // server.use(printMiddle);
  }

  protected listen(server: Express): void {
    server.listen(this.port, () => this.listening(this.port))
  }

  protected listening(port: number) {
    console.log(`Servidor iniciado na porta ${port}`)
  }
}
