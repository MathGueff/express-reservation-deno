import is from '@zarco/isness'

export class Env {
  static get port() {
    return Number(Deno.env.get('PORT') ?? '3000')
  }

  static getDatabasePasswordByUsername(databaseUsername: string): string {
    if (!databaseUsername) throw Error('Please provide a database username!')

    const password = Deno.env.get(`DATABASE_PASSWORD_FOR_${databaseUsername}`)
    if (!password) throw Error(`No password found for ${databaseUsername}`)
    return password
  }

  /** AUTHENTICATION */
  static get jwtSecret() {
    const token = Deno.env.get('JWT_SECRET')
    if (!token) {
      throw new Error('A variável de ambiente JWT deve estar definida')
    }
    return token
  }

  static get authAccessTokenExpiration() {
    return 36000000 // 10 hours
  }

  static get mongodbMaxPoolSize(): number | null {
    const mongodbMaxPoolSize = Deno.env.get('MONGODB_MAX_POOL_SIZE')

    if (!mongodbMaxPoolSize) {
      return null
    }

    if (!is.number(mongodbMaxPoolSize)) throw new Error(`Invalid MONGODB_MAX_POOL_SIZE: ${mongodbMaxPoolSize}`)

    return Number(mongodbMaxPoolSize)
  }
}
