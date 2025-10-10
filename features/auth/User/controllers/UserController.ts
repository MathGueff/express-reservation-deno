import { NextFunction, Request, Response } from 'npm:express'
import { ObjectId } from '../../../../globals/Mongo.ts'
import { Env } from '../../../../config/Env.ts'
import { Print } from '../../../../utilities/static/Print.ts'
import { throwlhos } from '../../../../globals/Throwlhos.ts'
import { UserRules } from '../UserRules.ts'
import { UserRepository } from '../../../../models/User/UserRepository.ts'
import { IUser } from '../../../../models/User/IUser.ts'
import { ICheckObj } from '../../../../base/BaseRules.ts'
import { Jwt } from '../../../../utilities/static/Jwt.ts'

export class UserController {
  private userRepository: UserRepository

  private rules: UserRules

  constructor(
    userRepository: UserRepository = new UserRepository(),
    rules = new UserRules(),
  ) {
    this.userRepository = userRepository
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
      const {name, email, password} = req.body as IUser;
      
      this.rules.validate(
        {name},
        {email},
        {password}
      )

      const newUser : IUser = {
        name,
        email,
        password
      };

      if (Env.local) {
        const print = new Print()

        print.info(
          'Cadastrando usuário'
        )
      }

      const created = await this.userRepository.createOne(newUser)

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
      const {email} = req.body

      const founded = await this.userRepository.findOne({email})

      if(!founded) {
          throw throwlhos.err_notFound('Nenhum usuário encontrado')
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
  

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string

      const update : IUser = {
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
      }

      const toValidate : ICheckObj[] = [{id}]

      if(update.name)
        toValidate.push({name : update.name})

      if(update.email)
        toValidate.push({email : update.email})
      
      this.rules.validate(...toValidate)

      if (Env.local) {
        const print = new Print()

        print.info(
          'Atualizando usuário',
          { id },
        )
      }

      const updated = await this.userRepository.updateOne({
        _id: ObjectId(id),
      }, { $set: update })

      if (!updated) {
        throw throwlhos.err_notFound(
          "Usuário não encontrado",
          { id, ...req.body },
        )
      }

      //TODO: Atualizar para utilizar send_ok
      return res.status(200).json({
        data: req.body,
      })
    } catch (error) {
      next(error)
    }
  }

  findById = async (req : Request, res : Response, next : NextFunction) => {
    try {
      const id = req.params.id as string

      this.rules.validate(
        { id }
      )

      if (Env.local) {
        const print = new Print()

        print.info(
          'Pesquisando por usuário',
          { id },
        )
      }

      const founded = await this.userRepository.findOne({
        _id: ObjectId(id),
      })

      if (!founded) {
        throw throwlhos.err_notFound(
          "Usuário não encontrado",
          { id, ...req.body },
        )
      }

      //TODO: Atualizar para utilizar send_ok
      return res.status(200).json({
        data: founded,
      })

    } catch (error) {
      next(error);
    }
  }

  delete = async (req : Request, res : Response, next : NextFunction) => {
    try {
      const id = req.params.id as string
      
      this.rules.validate(
        { id }
      )

      if (Env.local) {
        const print = new Print()

        print.info(
          'Removendo usuário',
          { id },
        )
      }

      const excluded = await this.userRepository.deleteOne({
        _id: ObjectId(id),
      })

      if (!excluded) {
        throw throwlhos.err_notFound(
          "Usuário não encontrado",
          { id, ...req.body },
        )
      }

      //TODO: Atualizar para utilizar send_ok
      return res.status(200).json({
        data: excluded,
      })
    } catch (error) {
      next(error)
    }
  }
}
