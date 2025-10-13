import { Types } from 'mongoose'

export interface IReservation{
    name : string
    owner : Types.ObjectId
    buyer ?: Types.ObjectId
    price : number,
    daysOfDuration : number
    startedDate ?: Date
    endDate ?: Date
}