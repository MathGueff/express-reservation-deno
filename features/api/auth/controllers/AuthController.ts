import { NextFunction, Request, Response } from 'npm:express'
import { throwlhos } from '../../../../globals/Throwlhos.ts'
import { AuthRules } from '../AuthRules.ts'
import { AuthRepository } from '../../../../models/Auth/AuthRepository.ts'
import { Jwt } from '../../../../utilities/static/Jwt.ts'

export class AuthController {
  private authRepository: AuthRepository

  private rules: AuthRules

  constructor(
    authRepository: AuthRepository = new AuthRepository(),
    rules = new AuthRules(),
  ) {
    this.authRepository = authRepository
    this.rules = rules
  }

  me = (req :Request, res : Response, next : NextFunction) => {
    try {
      const user = req.user;
      if(!user){
        throw throwlhos.err_unauthorized('É necessário um token válido')
      }
      return res.send_ok('auth.success.get-authenticated', {
        data: user
      })
    } catch (error) {
      next(error)
    }
  }

  login = async (req :Request, res : Response, next : NextFunction) => {
    try {
      const {email, password} = req.body

      this.rules.validate({email, password})

      const founded = await this.authRepository.findOne({email})

      if(!founded) {
        throw throwlhos.err_notFound('Nenhum usuário encontrado')
      }

      const checked = await founded.comparePassword(password)

      if(!checked){
        throw throwlhos.err_unauthorized('Email ou senha estão incorretos')
      }
      
      const token = Jwt.signToken(founded.id)
      return res.send_ok('auth.success.login', {
        token
      })
    } catch (error) {
      next(error)
    }
  }
}
