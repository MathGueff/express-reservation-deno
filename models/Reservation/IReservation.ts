import { Types } from 'mongoose'

export interface IReservation{
    owner : Types.ObjectId
    buyer ?: Types.ObjectId
    price : number
}