import { QueryOptions } from 'mongoose'
import { IUser } from '../../../models/User/IUser.ts'
import { UserRepository } from '../../../models/User/UserRepository.ts'
import { ObjectId } from '../../../globals/Mongo.ts'
import { throwlhos } from '../../../globals/Throwlhos.ts'

export class UserService {
  private userRepository: UserRepository

  constructor({
    userRepository = new UserRepository(),
  } = {}) {
    this.userRepository = userRepository
  }

  async findAll(options: QueryOptions) {
    const found = await this.userRepository.findMany({})
    // .skip(options?.skip ?? 0)
    // .limit(options?.limit ?? 10)

    if (found.length === 0) {
      throw throwlhos.err_notFound(
        'Nenhum usuário encontrado',
        { found },
      )
    }

    return found
  }

  async findById(id: string) {
    const found = await this.userRepository.findOne({
      _id: ObjectId(id),
    })

    if (!found) {
      throw throwlhos.err_notFound(
        'Usuário não encontrado',
        { id },
      )
    }
    return found
  }

  async create(newUser: IUser) {
    return await this.userRepository.create(newUser)
  }

  async update(id: string, update: Partial<IUser>) {
    const updated = await this.userRepository.updateOne(
      { _id: ObjectId(id) },
      { $set: update },
    )

    if (!updated) {
      throw throwlhos.err_notFound(
        'Usuário não encontrado',
        { id },
      )
    }
    return await this.userRepository.findById(id)
  }

  async remove(id: string) {
    const excluded = await this.userRepository.deleteOne({
      _id: ObjectId(id),
    })

    if (!excluded) {
      throw throwlhos.err_notFound(
        'Usuário não encontrado',
        { id },
      )
    }
    return excluded
  }
}
