import { BaseRepository } from '../../base/BaseRepository.ts'
import { IUser } from '../User/IUser.ts'
import { ExpressReservationDB } from '../../database/db/ExpressReservationDB.ts'
import { UserSchema } from '../User/User.ts'

class AuthRepository extends BaseRepository<IUser> {
  constructor(
    model = ExpressReservationDB.model<IUser>(
      'User',
      UserSchema,
    ),
  ) {
    super(model)
  }
}

export { AuthRepository }
