import { Types } from 'mongoose'
import { IBaseInterface } from '../../base/IBaseInterface.ts'

export interface IReservation extends IBaseInterface {
  name: string
  owner: Types.ObjectId
  buyer?: Types.ObjectId
  price: number
  daysOfDuration: number
  startedDate?: Date
  endDate?: Date
}
