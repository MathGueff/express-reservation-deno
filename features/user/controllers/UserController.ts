import { NextFunction, Request, Response } from 'npm:express'
import { UserRepository } from '../../../models/User/UserRepository.ts'
import { ICheckObj } from '../../../base/BaseRules.ts'
import { throwlhos } from '../../../globals/Throwlhos.ts'
import { IUser } from '../../../models/User/IUser.ts'
import { Print } from '../../../utilities/static/Print.ts'
import { ObjectId } from '../../../globals/Mongo.ts'
import { UserRules } from '../UserRules.ts'
import { User } from '../../../models/User/User.ts'
import { QueryOptions } from 'mongoose'

export class UserController {
  private userRepository: UserRepository;

  private rules: UserRules;

  constructor(
    userRepository: UserRepository = new UserRepository(),
    rules = new UserRules()
  ) {
    this.userRepository = userRepository;
    this.rules = rules;
  }

  register = async (req :Request, res : Response, next : NextFunction) => {
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

      const created = await this.userRepository.createOne(newUser)

      //TODO: Atualizar para utilizar send_ok
      return res.status(200).json({
        data: created,
      })
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string
      const update = new User({...req.body} as IUser)

      if(!update.name && !update.email && !update.password){
        throw throwlhos.err_badRequest('Informe um campo para ser atualizado');
      }

      const toValidate : ICheckObj[] = [{id}]

      if(update.name){
        toValidate.push({name : update.name})
      }

      if(update.email){
        toValidate.push({email : update.email})
      }
      
      this.rules.validate(...toValidate)
      
      if(update.password){
        await update.hashPassword()
      }

      const print = new Print()

      print.info(
        'Atualizando usuário',
        { id },
      )

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

      const print = new Print()

      print.info(
        'Pesquisando por usuário',
        { id },
      )
      

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

  findAll = async (req : Request, res : Response, next : NextFunction) => {
    try {
      const print = new Print()

      print.info(
        'Buscando todos usuários'
      )
      let options : QueryOptions = {};

      if(req.pagination){
        const limit = req.pagination.limit;
        const skip = req.pagination.page * limit - limit;
        options = {limit, skip}
      }

      const founded = await this.userRepository.findUsersWithPagination(options)

      if (founded.length === 0) {
        throw throwlhos.err_notFound(
          "Nenhum usuário encontrado"
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

      const print = new Print()

      print.info(
        'Removendo usuário',
        { id },
      )

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
