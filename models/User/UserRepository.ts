import { BaseRepository } from '../../base/BaseRepository.ts'
import { IUser } from './IUser.ts'
import { ExpressReservationDB } from '../../database/db/ExpressReservationDB.ts'
import { UserSchema } from './User.ts'
import { QueryOptions } from 'mongoose'

class UserRepository extends BaseRepository<IUser> {
  constructor(
    model = ExpressReservationDB.model<IUser>(
      'User',
      UserSchema
  ),
  ) {
    super(model)
  }

  findUsersWithPagination(options : QueryOptions){
    const find = this.model.find({})
      .skip(options?.skip ?? 0)
      .limit(options?.limit ?? 10)
    return find;
  }
}

export { UserRepository }
