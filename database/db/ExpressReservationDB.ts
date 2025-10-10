import { env, EnvTypes } from '../../config/Env.ts'
import { Database, IDatabaseConnection } from '../Database.ts'

const databaseConfiguration = env<IDatabaseConnection>({
  [EnvTypes.developmentLike]: {
    hostname: 'cluster0.zkpwmvs.mongodb.net',
    database: 'express-reservations',
    username: 'matheusgueff_db_user',
  },
}) as IDatabaseConnection

const database = new Database(databaseConfiguration)

export const connectionString = database.connectionString

const ExpressReservationDB = database.connect()

export { ExpressReservationDB }
