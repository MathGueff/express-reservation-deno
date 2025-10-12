import mongoose from 'mongoose'
import { Print } from '../utilities/static/Print.ts'
import { Env } from '../config/Env.ts'

const print = new Print()

export interface IDatabaseConnection {
  username: string
  hostname: string
  database: string
}

export class Database {
  private username: string
  private password: string
  private hostname: string
  private database: string

  private printConnectionStringOnConnect = true

  constructor(databaseConnection: IDatabaseConnection) {
    print.info('Connection', databaseConnection)

    this.hostname = databaseConnection.hostname
    this.database = databaseConnection.database
    this.username = databaseConnection.username
    this.password = Env.getDatabasePasswordByUsername(this.username)
    this.validate()
  }

  private validate = (): void => {
    if (!this.username) {
      throw Error('[Database] Please provide a database username!')
    }
    if (!this.hostname) {
      throw Error('[Database] Please provide a database hostname!')
    }
    if (!this.database) {
      throw Error('[Database] Please provide a database name!')
    }
    if (!this.password) {
      throw Error('[Database] Please provide a database password!')
    }
  }

  public get connectionString(): string {
    return `mongodb+srv://${this.username}:${this.password}@${this.hostname}/${this.database}`
  }

  public connect = (): mongoose.Connection => {
    try {
      if (this.printConnectionStringOnConnect) {
        print.info(this.connectionString)
      }
      // filtra propriedades que não estão no schema
      mongoose.set('strictQuery', false)

      const connection = mongoose.createConnection(this.connectionString)

      connection.on('connected', () => {
        print.success(
          `Successfully connected to ${this.database} at ${this.hostname}`,
        )
      })

      return connection
    } catch (error) {
      print.error(`Error connecting to database: ${error}`)
      throw error
    }
  }
}
