// deno-lint-ignore-file
import { Print } from '../utilities/static/Print.ts'
import { NextFunction, Request, Response } from 'npm:express'
import HttpStatus from 'npm:http-status-codes'
import fnCode from 'npm:fn-code'

const print = new Print()

const camelCase = (str: string) => str.toLowerCase().replace(/(\_\w)/g, (c) => c[1].toUpperCase())

type IOptions = {
  promptErrors: boolean | (() => boolean)
}

type IResponserrorObject = {
  code: number
  status: string
  message: string
  success: boolean
  errors: { [key: string]: any } | undefined
  [key: string]: unknown
}

export class Responserror {
  // deno-lint-ignore ban-types
  private preFunctions: Function[] = []

  // deno-lint-ignore ban-types
  private posFunctions: Function[] = []

  // deno-lint-ignore ban-types
  public pre = (fn: Function) => this.preFunctions.push(fn)

  // deno-lint-ignore ban-types
  public pos = (fn: Function) => this.posFunctions.push(fn)

  private options: IOptions

  private mapStatusByCode: { [code: number]: string } = {}

  private responserror: IResponserrorObject = {
    code: 500,
    status: 'INTERNAL_SERVER_ERROR',
    message: 'Internal Server Error',
    success: false,
    errors: undefined,
  }

  private setMapStatusByCode = () => {
    for (const [httpStatus, httpCode] of Object.entries(HttpStatus)) {
      if (
        !httpStatus.startsWith('get') &&
        typeof httpCode !== 'function' &&
        !['1', '2'].includes(String(httpCode).charAt(0))
      ) {
        Object.assign(this.mapStatusByCode, { [String(httpCode)]: httpStatus })
      }
    }
  }

  private setDefaultValuesForResponserror = () => {
    if (
      !['code', 'status', 'message'].some((prop) => this.responserror[prop])
    ) {
      this.responserror.code = 500
      this.responserror.status = 'INTERNAL_SERVER_ERROR'
      this.responserror.message = 'Internal Server Error'
    }
    if (!this.responserror.success) this.responserror.success = false
    if (!this.responserror.errors) this.responserror.errors = undefined
  }

  public getMessageByCode = function (code: string | number) {
    try {
      return HttpStatus.getStatusText(code)
    } catch (e: unknown) {
      console.warn(e)
      return undefined
    }
  }

  public getStatusByCode = (code: number): string | undefined => this.mapStatusByCode[code]

  public getCodeByStatus = (status: string): number | undefined => {
    for (const [httpStatus, httpCode] of Object.entries(HttpStatus)) {
      if (
        !httpStatus.startsWith('get') &&
        typeof httpCode !== 'function' &&
        !['1', '2'].includes(String(httpCode).charAt(0))
      ) {
        if (
          String(httpStatus).trim().toUpperCase() ==
            String(status).trim().toUpperCase()
        ) {
          return httpCode as number
        }
      }
    }
  }

  constructor(options: IOptions = { promptErrors: false }) {
    this.options = options
    this.setMapStatusByCode()
  }

  errorHandler = (
    error: any,
    _request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    /* Example Schema Validation Error

    {
    "status": "UNPROCESSABLE_ENTITY",
    "code": 422,
    "success": false,
    "message": "User validation failed: name: Nome inválido!, password: Senha inválida! Por favor insira uma senha mais forte!, accountConfirmation.cellphone.value: Path `value` is required.",
    "errors": {
        "name": {
            "name": "ValidatorError",
            "message": "Nome inválido!",
            "properties": {
                "message": "Nome inválido!",
                "type": "user defined",
                "path": "name",
                "value": "Teste 2"
            },
            "kind": "user defined",
            "path": "name",
            "value": "Teste 2"
        },
        "password": {
            "name": "ValidatorError",
            "message": "Senha inválida! Por favor insira uma senha mais forte!",
            "properties": {
                "message": "Senha inválida! Por favor insira uma senha mais forte!",
                "type": "user defined",
                "path": "password",
                "value": "123"
            },
            "kind": "user defined",
            "path": "password",
            "value": "123"
        },
        "accountConfirmation.cellphone.value": {
            "name": "ValidatorError",
            "message": "Path `value` is required.",
            "properties": {
                "message": "Path `value` is required.",
                "type": "required",
                "path": "value"
            },
            "kind": "required",
            "path": "value"
        }
    }
} */

    // Example Request Check Error

    /*

    {
    "status": "UNPROCESSABLE_ENTITY",
    "code": 422,
    "success": false,
    "message": "1 campos inválidos! (name)",
    "errors": [
        {
            "field": "name",
            "message": "Nome inválido!"
        }
    ]
}

 */
    this.preFunctions.forEach((fn) => fn.apply(null))

    if (error.status) {
      this.responserror.status = error.status
      const code = this.getCodeByStatus(error.status)
      if (code) this.responserror.code = code
    }

    if (error.code) {
      this.responserror.code = error.code
      const status = this.getStatusByCode(error.code)
      if (status) this.responserror.status = status
    }

    this.responserror.message = error.message ||
      this.getMessageByCode(this.responserror.code)
    this.responserror.errors = error.errors || error.content

    enum SchemaTypeErrors {
      ValidateError = 'ValidatorError',
      UniqueIndexError = 'UniqueIndexError',
      DefaultStatusError = 'DefaultStatusError',
    }

    let schemaTypeErrors: SchemaTypeErrors = SchemaTypeErrors.DefaultStatusError

    /*** ValidateError: VALIDATION ERROR FROM SCHEMA */

    function isValidationSchemaErrorObject(
      errors: { [key: string]: any } | undefined,
    ) {
      const errorsJson = JSON.stringify(errors)
      if (errorsJson.includes('ValidatorError')) return true
      return false
    }

    const isValidationSchemaError = this.responserror.errors &&
      isValidationSchemaErrorObject(this.responserror.errors)

    /*** UniqueIndexError: UNIQUE INDEX ERROR FROM SCHEMA */

    // console.log({ message: this.responserror.message })
    const isUniqueIndexError = this.responserror.message.includes('E11000')

    if (isValidationSchemaError) {
      schemaTypeErrors = SchemaTypeErrors.ValidateError
    }
    if (isUniqueIndexError) {
      schemaTypeErrors = SchemaTypeErrors.UniqueIndexError

      /* Replaces mongoose unique index error message to a more user friendly message
       * Example:
       * Original Message "Plan executor error during findAndModify :: caused by :: E11000 duplicate key error collection: ORCHESTRATOR_DEV_DB.users index: master.domain_1 dup key: { master.domain: "qualquerdominio.com" }"
       * Treated Message: "Já existe registro cadastrado com domain (master.domain: "novomasterdois.com")!"
       */

      this.responserror.message = this.responserror.message.replace(
        /.*index: (.*) dup key: { (.*) }/g,
        (_, index, key) => {
          const indexParts = index.split('.')
          let indexName = indexParts[indexParts.length - 1]
          const keyParts = key.split(',')
          const indexAndValue = keyParts
            .map((keyPart: string) => {
              const keyPartParts = keyPart.split(':')
              const keyName = keyPartParts[0].trim()
              const keyValue = keyPartParts[1].trim()
              return `${keyName}: ${keyValue}`
            })
            .join(', ')
          if (indexName.endsWith('_1')) indexName = indexName.slice(0, -2)
          return `Já existe registro cadastrado com ${indexName} (${indexAndValue})!`
        },
      )
    }

    /*** ErroDaAana:  */

    // const identificacaodoerrodaana = this.responserror.message.includes('ERRO DAHORA DA ANA')
    // if (identificacaodoerrodaana) schemaTypeErrors = SchemaTypeErrors.ErrorNovoLegalDaAna

    /*** Chose status by error type */

    const status = fnCode.default.one(
      schemaTypeErrors,
      {
        [SchemaTypeErrors.ValidateError]: 'Bad Request',
        [SchemaTypeErrors.UniqueIndexError]: 'Conflict',
        // [SchemaTypeErrors.ErrorNovoLegalDaAna]: 'Banana Ana Error'
      },
      {
        default: this.responserror.status,
      },
    )

    const responserLikeStatus = camelCase(status)

    this.setDefaultValuesForResponserror()

    const responserrorObject = { ...this.responserror, ...error }

    if (isValidationSchemaError) {
      // @ts-ignore is necessary
      responserrorObject.errors = Object.entries(this.responserror.errors).map(
        ([field, { message }]: [string, { message: string }]) => {
          const fieldName = field
          return {
            field: fieldName,
            message,
          }
        },
      )

      if (responserrorObject.errors.length) {
        responserrorObject.status = 'BAD_REQUEST'
        responserrorObject.code = 400
      }
    }

    if (
      this.options.promptErrors === true ||
      (typeof this.options.promptErrors === 'function' &&
        this.options.promptErrors())
    ) {
      // Handle ALL errors
      print.error('Error', error)
    }

    this.posFunctions.forEach((fn) => fn.apply(null))

    delete responserrorObject?._message

    // @ts-ignore: responserLikeStatus is a valid method
    if (typeof response[`send_${responserLikeStatus}`] === 'function') {
      // @ts-ignore: responserLikeStatus is a valid method
      return response[`send_${responserLikeStatus}`](
        this.responserror.message,
        responserrorObject?.errors,
      )
    }

    const defineResponseErrorCode = (responserrorObject: { code?: number }) => {
      if (responserrorObject?.code && !isNaN(responserrorObject.code)) {
        const code = Number(responserrorObject.code)
        if (code >= 100 && code < 600) {
          return code
        }
      }
      return this.responserror.code ?? 500
    }

    const responseErrorCode = defineResponseErrorCode(responserrorObject)

    return response.status(responseErrorCode).json(responserrorObject)
  }
}
