import { ClientSession } from 'mongoose'
import { BaseRepository } from '../../base/BaseRepository.ts'
import { ExpressReservationDB } from '../../database/db/ExpressReservationDB.ts'
import { ObjectId } from '../../globals/Mongo.ts'
import { IReservation } from './IReservation.ts'
import { IReservationFilter, ReservationSchema } from './Reservation.ts'

class ReservationRepository extends BaseRepository<IReservation> {
  constructor(
    model = ExpressReservationDB.model<IReservation>(
      'Reservation',
      ReservationSchema,
    ),
  ) {
    super(model)
  }

  findManyWithFilter(filter: IReservationFilter): Promise<Array<IReservation>> {
    const models = this.model
      .find()
      .limit(filter.limit ?? 10)
      .skip(filter.skip ?? 0)

    return models
  }

  findReservationByActiveUser(id: string) {
    const models = this.model.find({
      $or: [{ buyer: ObjectId(id) }, { owner: ObjectId(id) }],
    })
    return models
  }

  updateReservationWithSession(id: string, buyerId: string, daysOfDuration: number, session: ClientSession) {
    return this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          buyer: buyerId,
          startedDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + daysOfDuration)),
        },
      },
      { new: true, session },
    )
  }
}

export { ReservationRepository }
