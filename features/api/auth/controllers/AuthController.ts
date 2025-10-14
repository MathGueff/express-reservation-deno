import { NextFunction, Request, Response } from 'npm:express'
import { throwlhos } from '../../../../globals/Throwlhos.ts'
import { AuthRules } from '../AuthRules.ts'
import { AuthRepository } from '../../../../models/Auth/AuthRepository.ts'
import { Jwt } from '../../../../utilities/static/Jwt.ts'
import bcrypt from 'bcrypt'

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
        throw throwlhos.err_unauthorized('É necessário um token válido', {user})
      }
      return res.send_ok('Informações da sua conta recuperadas com sucesso', {
        user
      })
    } catch (error) {
      next(error)
    }
  }

  login = async (req :Request, res : Response, next : NextFunction) => {
    try {
      const {email, password} = req.body

      this.rules.validate({email}, {password})

      const founded = await this.authRepository.findOne({email})
      const checked = await bcrypt.compare(password, founded?.password);

      if(!founded || !checked) {
        throw throwlhos.err_unauthorized('Email ou senha estão incorretos', {
          email, password
        })
      }
      
      const token = Jwt.signToken(founded.id)
      return res.send_ok('Login realizado com sucesso', {
        token
      })
    } catch (error) {
      next(error)
    }
  }
}
