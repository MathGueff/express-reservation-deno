import { NextFunction, Request, Response } from 'express'
import { throwlhos } from '../globals/Throwlhos.ts'
import { UserRepository } from '../models/User/UserRepository.ts'
import jwt from 'jsonwebtoken'
import { Env } from '../config/Env.ts'

export const AuthMiddle = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization

    if (!auth) {
      throw throwlhos.err_unauthorized('Acesso negado: sem autorização', { sentHeaders: req.headers })
    }

    const [, token] = auth.split(' ')

    const verified = jwt.verify(token, Env.jwtSecret)

    if (!verified && verified.id) {
      throw throwlhos.err_unauthorized('Token inválido', { verified, token })
    }

    const userRepository = new UserRepository()

    const authenticated = await userRepository.findById(verified.id)
    req.user = authenticated
    return next()
  } catch (error) {
    return next(error)
  }
}
