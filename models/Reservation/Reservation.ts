import { IReservation } from './IReservation.ts'
import { BaseSchema } from '../../base/BaseSchema.ts'
import { ObjectId } from '../../globals/Mongo.ts'

export class Reservation implements IReservation{
  owner : IReservation['owner']
  buyer ?: IReservation['buyer']
  price : IReservation['price']

  constructor(reservation : IReservation){
    this.buyer = reservation.buyer,
    this.price = reservation.price,
    this.owner = reservation.owner
  }
}

export class ReservationSchemaClass extends BaseSchema{
  constructor(){
    super({
        owner : {
            type : ObjectId,
            required : true
        },
        buyer : {
            type : ObjectId,
            default : null
        },
        price : {
          type : Number,
          required : true
        }
    })
  }
}

const ReservationSchema = new ReservationSchemaClass().schema

ReservationSchema.loadClass(Reservation) 

export {ReservationSchema}