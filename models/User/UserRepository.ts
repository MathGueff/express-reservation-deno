import { BaseRepository } from '../../base/BaseRepository.ts'
import { IUser } from './IUser.ts'
import { ExpressReservationDB } from '../../database/db/ExpressReservationDB.ts'
import { IUserFilter, UserSchema } from './User.ts'

class UserRepository extends BaseRepository<IUser> {
  constructor(
    model = ExpressReservationDB.model<IUser>(
      'User',
      UserSchema,
    ),
  ) {
    super(model)
  }

  findManyWithFilter(filter : IUserFilter) : Promise<Array<IUser>>{
    console.log(filter)
    const models = this.model
    .find()
    .limit(filter.limit ?? 10)
    .skip(filter.skip ?? 0)

    return models;
  }
}

export { UserRepository }
