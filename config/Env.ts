import is from '@zarco/isness'
type ConstEnum<T, V = string> = Extract<T[keyof T], V>
export type EnvironmentName = ConstEnum<typeof EnvironmentName>
let name = Deno.env.get('ENV') as EnvironmentNameEnum ?? Deno.args[0] ?? 'local'

export const EnvironmentName = {
  local: 'local',
  dev: 'dev',
  hml: 'hml',
  jobs: 'jobs',
  server: 'server',
  app: 'app',
  api: 'api',
  hooks: 'hooks',
} as const

export enum EnvironmentNameEnum {
  local = 'local',
  dev = 'dev',
  hml = 'hml',
  jobs = 'jobs',
  server = 'server',
  app = 'app',
  api = 'api',
  hooks = 'hooks',
}

export class Env {
  static get name() {
    return name
  }

  static get ip() {
    return Deno.env.get('IP') ?? '0.0.0.0'
  }

  static get owned() {
    return Boolean(Deno.env.get('OWNER'))
  }

  static get server() {
    return name === EnvironmentName.server
  }

  static get app() {
    return name === EnvironmentName.app
  }

  static get api() {
    return name === EnvironmentName.api
  }

  static get jobs() {
    return name === EnvironmentName.jobs
  }

  static get hooks() {
    return name === EnvironmentName.hooks
  }

  static get hml() {
    return name === EnvironmentName.hml
  }

  static get dev() {
    return name === EnvironmentName.dev
  }

  static get local() {
    return Boolean(this.ip) && !this.dev && !this.hml && !this.server && !this.app && !this.api && !this.jobs && !this.hooks
  }

  static get isRunningLocally() {
    return Boolean(Deno.env.get('IP'))
  }

  static get isDevLike() {
    return this.local || this.dev || this.hml
  }

  static get isProductionLike() {
    return (this.server || this.app || this.api || this.jobs || this.hooks)
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

  static get jwtAuthAlgorithm() {
    return 'HS256'
  }

  static get authAccessTokenExpiration() {
    return 36000000 // 10 hours
  }

  static get authRefreshTokenExpiration() {
    return Number(Deno.env.get('AUTH_REFRESH_TOKEN_EXPIRATION') || 1800000) // 30 minutes
  }

  static get mongodbMaxPoolSize(): number | null {
    const mongodbMaxPoolSize = Deno.env.get('MONGODB_MAX_POOL_SIZE')

    if (!mongodbMaxPoolSize) {
      return null
    }

    if (!is.number(mongodbMaxPoolSize)) throw new Error(`Invalid MONGODB_MAX_POOL_SIZE: ${mongodbMaxPoolSize}`)

    return Number(mongodbMaxPoolSize)
  }


  static get SERVER_ENVIRONMENTS() {
    return [
      EnvironmentNameEnum.server,
    ]
  }

  static get APP_ENVIRONMENTS() {
    return [
      EnvironmentNameEnum.app,
    ]
  }

  static get API_ENVIRONMENTS() {
    return [
      EnvironmentNameEnum.api,
    ]
  }

  static get JOB_ENVIRONMENTS() {
    return [
      EnvironmentNameEnum.jobs,
    ]
  }

  static get PROCEDURE_ENVIRONMENTS() {
    return [
      EnvironmentNameEnum.server,
    ]
  }
}

export const EnvTypes = {
  local: 'local',
  hml: 'hml',
  dev: 'dev',
  server: 'server',
  app: 'app',
  developmentLike: 'developmentLike',
  productionLike: 'productionLike',
} as const

type EnvType = keyof typeof EnvTypes

type EnvObject<T> = { [key in EnvType]?: T }

export const env = <T = string>(objectOfEnvs: EnvObject<T>): T | string => {
  const keys: EnvType[] = Object.keys(objectOfEnvs) as EnvType[]
  let result: T | null = null

  keys.forEach((key) => {
    if (!result && key === name && objectOfEnvs[key]) {
      result = objectOfEnvs[key] as T
    }
    if (!result && key === EnvTypes.developmentLike && Env.isDevLike) {
      result = objectOfEnvs[EnvTypes.developmentLike] as T
    }
    if (!result && key === EnvTypes.productionLike && Env.isProductionLike) {
      result = objectOfEnvs[EnvTypes.productionLike] as T
    }
  })
  return result ?? ''
}
