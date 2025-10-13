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
}

export { UserRepository }
