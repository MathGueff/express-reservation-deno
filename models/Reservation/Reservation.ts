import { IReservation } from './IReservation.ts'
import { BaseSchema } from '../../base/BaseSchema.ts'
import { ObjectId } from '../../globals/Mongo.ts'
import { string } from '@zarco/isness'
import { Types } from 'mongoose'

export class Reservation implements IReservation {
  name: IReservation['name']
  owner: IReservation['owner']
  buyer?: IReservation['buyer']
  price: IReservation['price']
  daysOfDuration: IReservation['daysOfDuration']
  startedDate?: IReservation['startedDate']
  endDate?: IReservation['endDate']


  constructor(reservation: IReservation) {
    this.name = reservation.name
    this.buyer = reservation.buyer, this.price = reservation.price, this.owner = reservation.owner
    this.daysOfDuration = reservation.daysOfDuration
    this.startedDate = reservation.startedDate
    this.endDate = reservation.endDate
  }
}

export interface IReservationFilter{
  _id ?: Types.ObjectId,
  userId ?: Types.ObjectId,
  skip ?: number,
  limit ?: number
}

export class ReservationSchemaClass extends BaseSchema {
  constructor() {
    super({
      name: {
        type: string,
        required: true,
        unique: true,
        minlength: 6,
      },
      owner: {
        type: ObjectId,
        required: true,
      },
      buyer: {
        type: ObjectId,
        required: false,
        default: null,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      daysOfDuration: {
        type: Number,
        required: true,
        min: 1,
      },
      startedDate: {
        type: Date,
        required: false,
        default: null,
      },
      endDate: {
        type: Date,
        required: false,
        default: null,
      },
    }, {
      versionKey: false,
    })
  }
}

const ReservationSchema = new ReservationSchemaClass().schema

ReservationSchema.loadClass(Reservation)

export { ReservationSchema }
