import { NextFunction, Request, Response } from 'npm:express'
import { ObjectId } from '../../../../globals/Mongo.ts'
import { Env } from '../../../../config/Env.ts'
import { Print } from '../../../../utilities/static/Print.ts'
import { throwlhos } from '../../../../globals/Throwlhos.ts'
import { UserRules } from '../UserRules.ts'
import { UserRepository } from '../../../../models/User/UserRepository.ts'
import { IUser } from '../../../../models/User/IUser.ts'
import { ICheckObj } from '../../../../base/BaseRules.ts'

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

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string
      const update: Partial<IUser> = req.body as Partial<IUser>
      
      this.rules.validate(
        { id }, {name : update.name}, {email : update.email}
      )

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
}
