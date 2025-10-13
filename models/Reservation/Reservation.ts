import { IReservation } from './IReservation.ts'
import { BaseSchema } from '../../base/BaseSchema.ts'
import { ObjectId } from '../../globals/Mongo.ts'
import { string } from '@zarco/isness'

export class Reservation implements IReservation{
  name: IReservation['name']
  owner : IReservation['owner']
  buyer ?: IReservation['buyer']
  price : IReservation['price']

  constructor(reservation : IReservation){
    this.name = reservation.name
    this.buyer = reservation.buyer,
    this.price = reservation.price,
    this.owner = reservation.owner
  }

  isOwnerBuying(buyer : string): boolean {
    return this.owner.toString() == buyer
  }
}

export class ReservationSchemaClass extends BaseSchema{
  constructor(){
    super({
        name : {
          type : string,
          required: true
        },
        owner : {
            type : ObjectId,
            required : true
        },
        buyer : {
            type : ObjectId,
            required: false,
            default : null,
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