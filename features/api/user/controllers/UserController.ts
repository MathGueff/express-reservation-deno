import { NextFunction, Request, Response } from 'npm:express'
import { UserRepository } from '../../../../models/User/UserRepository.ts'
import { throwlhos } from '../../../../globals/Throwlhos.ts'
import { ObjectId } from '../../../../globals/Mongo.ts'
import { UserRules } from '../UserRules.ts'
import { User } from '../../../../models/User/User.ts'
import { QueryOptions } from 'mongoose'
import { IUser } from '../../../../models/User/IUser.ts'

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

  create = async (req :Request, res : Response, next : NextFunction) => {
    try {
      const {name, email, password, balance} = req.body

      this.rules.validate(
        {name}, {email}, {password}, {balance, isRequiredField : false}
      )
      
      const newUser = new User({ name, email, password, balance})

      const created = await this.userRepository.createOne(newUser)

      return res.send_created('Usuário cadastrado com sucesso', {
        user: created,
      })
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id

      const {name, email, balance} = req.body;

      this.rules.validate(
        {name, isRequiredField: false},
        {email, isRequiredField: false},
        {balance, isRequiredField: false}
      )

      const update : Partial<IUser> = {
        email, name, balance        
      }
      
      const updated = await this.userRepository.updateOne(
        {_id: ObjectId(id)},
        { $set: update }
      )

      if (!updated) {
        throw throwlhos.err_notFound(
          "Usuário não encontrado",
          { id },
        )
      }

      return res.send_ok('Usuário atualizado com sucesso', {
        user: updated
      })
    } catch (error) {
      next(error)
    }
  }

  findById = async (req : Request, res : Response, next : NextFunction) => {
    try {
      const id = req.params.id

      const found = await this.userRepository.findOne({
        _id: ObjectId(id),
      })

      if (!found) {
        throw throwlhos.err_notFound(
          "Usuário não encontrado",
          { id },
        )
      }

      return res.send_ok('Usuário encontrado com sucesso', {
        user : found
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

      const found = await this.userRepository.findMany({})
        .skip(options?.skip ?? 0)
        .limit(options?.limit ?? 10)

      if (found.length === 0) {
        throw throwlhos.err_notFound(
          "Nenhum usuário encontrado",
          {found}
        )
      }

      return res.send_ok('Usuários encontrados com sucesso', {
        users : found
      })
    } catch (error) {
      next(error);
    }
  }

  delete = async (req : Request, res : Response, next : NextFunction) => {
    try {
      const id = req.params.id

      const excluded = await this.userRepository.deleteOne({
        _id: ObjectId(id),
      })

      if (!excluded) {
        throw throwlhos.err_notFound(
          "Usuário não encontrado",
          { id },
        )
      }

      return res.send_ok('Usuário removido com sucesso', {
        user: excluded,
      })
    } catch (error) {
      next(error)
    }
  }
}
