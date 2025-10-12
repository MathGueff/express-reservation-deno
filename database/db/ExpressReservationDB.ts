import { Database, IDatabaseConnection } from '../Database.ts'

const databaseConfiguration : IDatabaseConnection = {
   hostname: 'cluster0.zkpwmvs.mongodb.net',
  database: 'express-reservations',
  username: 'test',
}

const database = new Database(databaseConfiguration)

export const connectionString = database.connectionString

const ExpressReservationDB = database.connect()

export { ExpressReservationDB }
