import is from '@zarco/isness'
import { NextFunction, Request, Response } from 'npm:express'
import { BaseRules } from '../base/BaseRules.ts'
import { throwlhos } from '../globals/Throwlhos.ts'

class PaginateRules extends BaseRules {
  constructor() {
    super()

    this.rc.addRules('page', [
      {
        validator: is.number,
        message: 'Valor para a página inválido! Deve ser um número.',
      },
      {
        validator: (page : number) => page >= 0,
        message: 'O page deve ser maior ou igual zero'
      }
      
    ])

    this.rc.addRules('limit', [
      {
        validator: is.number,
        message: 'Valor para o limite inválido! Deve ser um número.',
      },{
        validator: (limit : number) => limit >= 0,
        message: 'O limite deve ser maior ou igual zero'
      }
    ])
  }
}

export namespace IPaginationMiddle {
  export interface input {
    pageDefault?: number
    limitDefault?: number
    maxLimit?: number
  }

  export interface output {
    page: number
    limit: number
  }
}

export const PaginationMiddle = ({ pageDefault = 1, limitDefault = 10, maxLimit = 50 }: IPaginationMiddle.input = {}) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const page = req.query.page ?? pageDefault
    const limit = req.query.limit ?? limitDefault

    const paginateRules = new PaginateRules()

    paginateRules.validate(
      { page },
      { limit },
    )

    if (Number(limit) > maxLimit) {
      throw throwlhos.err_badRequest(
        `O limite máximo permitido é ${maxLimit}.`,
      )
    }

    req.pagination = {
      page: Number(page),
      limit: Number(limit),
    }

    next()
  }
}
