import { QueryOptions } from 'mongoose'
import { ReservationRepository } from '../../../models/Reservation/ReservationRepository.ts'
import { throwlhos } from '../../../globals/Throwlhos.ts'
import { IReservation } from '../../../models/Reservation/IReservation.ts'
import { ObjectId } from '../../../globals/Mongo.ts'

export class ReservationService {
  private reservationRepository: ReservationRepository

  constructor() {
    this.reservationRepository = new ReservationRepository()
  }

  async findAll(options: QueryOptions) {
    const reservations = await this.reservationRepository.findMany({})
      .skip(options?.skip ?? 0)
      .limit(options?.limit ?? 10)

    if (reservations.length === 0) {
      throw throwlhos.err_notFound('Nenhuma reserva encontrada', { reservations })
    }

    return reservations
  }

  async findById(id: string) {
    const reservation = await this.reservationRepository.findById(id)

    if (!reservation) {
      throw throwlhos.err_notFound('Nenhuma reserva encontrada', { reservation })
    }

    return reservation
  }

  async findMyReservations(id: string) {
    const reservations = await this.reservationRepository.findMany({
      $or: [
        { buyer: ObjectId(id) },
        { owner: ObjectId(id) },
      ],
    })

    if (reservations.length === 0) {
      throw throwlhos.err_notFound('Nenhuma reserva encontrada', { reservations })
    }

    return reservations
  }

  async create(newReservation: IReservation) {
    return await this.reservationRepository.create(newReservation)
  }

  async reserve(id: string, buyer: string, balance: number) {
    const reservation = await this.reservationRepository.findById(id)

    if (!reservation) {
      throw throwlhos.err_notFound('Reserva não encontrada', { reservation })
    }

    if (reservation.owner.toString() == buyer) {
      throw throwlhos.err_badRequest('Não é possível reservar sua própria reserva', {
        buyer,
        owner: reservation.owner,
      })
    }

    if (reservation.buyer) {
      throw throwlhos.err_unprocessableEntity('A reserva já está em uso', { buyer: reservation.buyer })
    }

    if (reservation.price > balance) {
      throw throwlhos.err_unprocessableEntity('Saldo insuficiente para a compra da reserva')
    }

    return reservation
  }

  async unlink(id: string) {
    const reservation = await this.reservationRepository.findById(id)

    if (!reservation) {
      throw throwlhos.err_notFound('Nenhuma reserva encontrada', {
        id,
      })
    }

    if (!reservation.buyer) {
      throw throwlhos.err_unprocessableEntity('A reserva ainda não foi alugada', {
        reservation,
      })
    }

    const today = new Date()

    if (reservation.endDate && reservation.endDate > today) {
      throw throwlhos.err_unprocessableEntity('Não é possível encerrar uma reserva com finalização pendente', {
        today,
        endDate: reservation.endDate,
      })
    }

    const unlinked = await this.reservationRepository.findOneAndUpdate(ObjectId(id), {
      buyer: null,
      startedDate: null,
      endDate: null,
    })

    return unlinked
  }

  async update(id: string, update: Partial<IReservation>) {
    const reservation = await this.reservationRepository.findById(id)

    if (!reservation) {
      throw throwlhos.err_notFound('Nenhuma reserva encontrada')
    }

    if (reservation.buyer) {
      throw throwlhos.err_unprocessableEntity('Não é possível alterar a reserva enquanto estiver em uso')
    }

   await this.reservationRepository.updateById(id, update)

    return await this.reservationRepository.findById(id)
  }

  async remove(id: string) {
    const deleted = await this.reservationRepository.deleteById(id)
    console.log(deleted)

    if (!deleted) {
      throw throwlhos.err_notFound('Reserva não encontrada', { reservation : deleted })
    }

    return deleted
  }
}
