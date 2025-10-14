import { IReservation } from './IReservation.ts'
import { BaseSchema } from '../../base/BaseSchema.ts'
import { ObjectId } from '../../globals/Mongo.ts'
import { string } from '@zarco/isness'

export class Reservation implements IReservation{
  name: IReservation['name']
  owner : IReservation['owner']
  buyer ?: IReservation['buyer']
  price : IReservation['price']
  daysOfDuration : IReservation['daysOfDuration']
  startedDate ?: IReservation['startedDate']
  endDate ?: IReservation['endDate']

  constructor(reservation : IReservation){
    this.name = reservation.name
    this.buyer = reservation.buyer,
    this.price = reservation.price,
    this.owner = reservation.owner
    this.daysOfDuration = reservation.daysOfDuration
    this.startedDate = reservation.startedDate
    this.endDate = reservation.endDate
  }
}

export class ReservationSchemaClass extends BaseSchema{
  constructor(){
    super({
        name : {
          type : string,
          required: true,
          unique: true,
          minlength : 6
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
          required : true,
          min: 0
        },
        daysOfDuration : {
          type : Number,
          required : true,
          min: 1
        },
        startedDate : {
          type : Date,
          required : false,
          default : null
        },
        endDate : {
          type : Date,
          required: false,
          default: null
        }
    })
  }
}

const ReservationSchema = new ReservationSchemaClass().schema

ReservationSchema.pre('findOneAndUpdate', async function(next){
  const toUpdate = await this.model.findOne(this.getQuery())
  if(!toUpdate){
    next()
    return;
  }
  if(toUpdate.startedDate || toUpdate.endDate) {
    next();
    return
  }
  toUpdate.startedDate = new Date();
  toUpdate.endDate = new Date().setDate(new Date().getDate() + toUpdate.daysOfDuration)
  toUpdate.save()
  next()
})

ReservationSchema.loadClass(Reservation) 

export {ReservationSchema}