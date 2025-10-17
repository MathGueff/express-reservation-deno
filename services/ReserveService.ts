import { ReservationRepository } from '../models/Reservation/ReservationRepository.ts'
import { UserRepository } from '../models/User/UserRepository.ts'
import { ObjectId, StartTransaction } from '../globals/Mongo.ts'
import { ExpressReservationDB } from '../database/db/ExpressReservationDB.ts'

class ReserveService {
  private reservationRepository: ReservationRepository
  private userRepository: UserRepository

  constructor({
    reservationRepository = new ReservationRepository(),
    userRepository = new UserRepository(),
  } = {}) {
    this.reservationRepository = reservationRepository
    this.userRepository = userRepository
  }

  async reserve(id: string, buyerId: string, ownerId: string, price: number) {
    const session = await StartTransaction(ExpressReservationDB)
    try {
      await this.reservationRepository.updateOne(ObjectId(id), { buyer: ObjectId(buyerId) }).session(session)
      // await this.userRepository.updateOne(ObjectId(buyerId), { $inc: { balance: -price } }).session(session)
      // await this.userRepository.updateOne(ObjectId(ownerId), { $inc: { balance: price } }).session(session)

      await session.commitTransaction()

      const reservationUpdated = await this.reservationRepository.findById(id)
      return reservationUpdated
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      await session.endSession()
    }
  }
}

export { ReserveService }
