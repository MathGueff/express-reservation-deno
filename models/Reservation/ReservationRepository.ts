import { QueryOptions } from 'mongoose'
import { BaseRepository } from '../../base/BaseRepository.ts'
import { ExpressReservationDB } from '../../database/db/ExpressReservationDB.ts'
import { Reservation } from './Reservation.ts'
import { ReservationSchema } from './Reservation.ts'

class ReservationRepository extends BaseRepository<Reservation>{
    constructor(
        model = ExpressReservationDB.model<Reservation>(
            'Reservation',
            ReservationSchema
        )
    ){
        super(model)
    }

    findReservationWithPagination(options : QueryOptions){
        const find = this.model.find({})
          .skip(options?.skip ?? 0)
          .limit(options?.limit ?? 10)
        return find;
    }
}

export {ReservationRepository}