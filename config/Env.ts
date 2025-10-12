import is from '@zarco/isness'
export class Env {
  static get port(){
    return Number(Deno.env.get('PORT') ?? "3000")
  }
  
  static getDatabasePasswordByUsername(databaseUsername: string): string {
    if (!databaseUsername) throw Error('Please provide a database username!')

    const password = Deno.env.get(`DATABASE_PASSWORD_FOR_${databaseUsername}`)
    if (!password) throw Error(`No password found for ${databaseUsername}`)
    return password
  }

  /** AUTHENTICATION */
  static get jwtSecret() {
    return Deno.env.get('JWT_SECRET') ??
      'SDNuuJ3zhxLoZiYVXiBEq+X6H2SgIAnXE+ZIB7Fk5dk='
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