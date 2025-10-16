import { NextFunction, Request, Response } from 'express'
import { throwlhos } from '../globals/Throwlhos.ts'
import jwt from 'jsonwebtoken'
import { Env } from '../config/Env.ts'

export const AuthMiddle = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization

    if (!auth) {
      throw throwlhos.err_unauthorized('Acesso negado: sem autorização', { sentHeaders: req.headers })
    }

    const [, token] = auth.split(' ')

    const verified = jwt.verify(token, Env.jwtSecret, (err: unknown, decoded: string) => {
      if (err) {
        throw throwlhos.err_unauthorized('Token inválido', { err, decoded, sentHeaders: req.headers })
      }
      return decoded
    })

    req.userId = verified.id
    return next()
  } catch (error) {
    return next(error)
  }
}
