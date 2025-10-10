import express, { Express } from 'npm:express'
import cors from 'npm:cors'
import helmet from 'npm:helmet'
import responser from 'responser'
import { Env } from '../config/Env.ts'

export abstract class AbstractEnvironment {
  public port: number
  public ip: string = ''

  constructor(port: number) {
    this.port = port
    if (Env.ip) this.ip = Env.ip
  }

  protected initializeDefaultMiddlewares(server: Express): void {
    server.use(cors())

    server.use(helmet())

    server.use(responser.default)

    server.use(express.json())

    server.use(express.urlencoded({ extended: true }))

    server.use(express.static('public'))
  }

  protected listen(server: Express): void {
    server.listen(this.port, this.ip)
  }
}
