import { NextFunction, Request, Response } from 'npm:express'
import { UserRepository } from '../../../models/User/UserRepository.ts'
import { ICheckObj } from '../../../base/BaseRules.ts'
import { throwlhos } from '../../../globals/Throwlhos.ts'
import { IUser } from '../../../models/User/IUser.ts'
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
      const newUser = new User({...req.body} as IUser)
      
      this.rules.validate(
        ...Object.entries(newUser)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => ({ [key]: value }))
      )

      const created = await this.userRepository.createOne(newUser)

      return res.send_ok('user.success.register', {
        data: req.body,
      })
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string
      const update = new User({...req.body} as IUser)
      update.balance = Number(update.balance)

      const toValidate : ICheckObj[] = [
        ...Object.entries(update)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => ({ [key]: value }))
      ]
      
      if(toValidate.length === 0){
        throw throwlhos.err_badRequest('Informe um campo para ser atualizado');
      }

      toValidate.push({id})

      this.rules.validate(...toValidate)
      
      if(update.password){
        await update.hashPassword()
      }
      
      const updated = await this.userRepository.updateOne(
        {_id: ObjectId(id)}, 
        { $set: update }
      )

      if (!updated) {
        throw throwlhos.err_notFound(
          "Usuário não encontrado",
          { id, ...req.body },
        )
      }

      return res.send_ok('user.success.update', {
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

      const found = await this.userRepository.findOne({
        _id: ObjectId(id),
      })

      if (!found) {
        throw throwlhos.err_notFound(
          "Usuário não encontrado",
          { id, ...req.body },
        )
      }

      return res.send_ok('user.success.findById', {
        data : found
      })

    } catch (error) {
      next(error);
    }
  }

  findAll = async (req : Request, res : Response, next : NextFunction) => {
    try {

      let options : QueryOptions = {};

      if(req.pagination){
        const limit = req.pagination.limit;
        const skip = req.pagination.page * limit - limit;
        options = {limit, skip}
      }

      const found = await this.userRepository.findUsersWithPagination(options)

      if (found.length === 0) {
        throw throwlhos.err_notFound(
          "Nenhum usuário encontrado"
        )
      }

      return res.send_ok('user.success.findAll', {
        data : found
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

      const excluded = await this.userRepository.deleteOne({
        _id: ObjectId(id),
      })

      if (!excluded) {
        throw throwlhos.err_notFound(
          "Usuário não encontrado",
          { id, ...req.body },
        )
      }

      return res.send_ok('user.success.register', {
        data: excluded,
      })
    } catch (error) {
      next(error)
    }
  }
}
