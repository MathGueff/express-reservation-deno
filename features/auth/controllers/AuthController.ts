import { NextFunction, Request, Response } from 'npm:express'
import { Print } from '../../../utilities/static/Print.ts'
import { throwlhos } from '../../../globals/Throwlhos.ts'
import { AuthRules } from '../AuthRules.ts'
import { IUser } from '../../../models/User/IUser.ts'
import { AuthRepository } from '../../../models/Auth/AuthRepository.ts'
import { Jwt } from '../../../utilities/static/Jwt.ts'

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
      return res.status(200).json({
        data: req.user,
      })
    } catch (error) {
      next(error)
    }
  }

  create = async (req :Request, res : Response, next : NextFunction) => {
    try {
      const newUser : IUser = req.body as IUser;
      
      this.rules.validate(
        {name : newUser.name},
        {email : newUser.email},
        {password : newUser.password}
      )
      
      const print = new Print()

      print.info(
        'Cadastrando usuário'
      )

      const created = await this.authRepository.createOne(newUser)

      //TODO: Atualizar para utilizar send_ok
      return res.status(200).json({
        data: created,
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
      //TODO: Atualizar para utilizar send_ok
      return res.status(200).json({
        token,
      })
    } catch (error) {
      next(error)
    }
  }
}
