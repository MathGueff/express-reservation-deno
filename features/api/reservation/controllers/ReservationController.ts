import { NextFunction, Request, Response } from 'express'
import { ReservationRepository } from '../../../../models/Reservation/ReservationRepository.ts'
import { ReservationRules } from '../ReservationRules.ts'
import { throwlhos } from '../../../../globals/Throwlhos.ts'
import { QueryOptions } from 'mongoose'
import { Reservation } from '../../../../models/Reservation/Reservation.ts'
import { ObjectId } from '../../../../globals/Mongo.ts'
import { ReserveService } from '../../../../services/ReserveService.ts'

export class ReservationController {
  private reservationRepository: ReservationRepository

  private rules: ReservationRules

  constructor(
    reservationRepository: ReservationRepository = new ReservationRepository(),
    rules = new ReservationRules(),
  ) {
    this.reservationRepository = reservationRepository
    this.rules = rules
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let options: QueryOptions = {}

      if (req.pagination) {
        const limit = req.pagination.limit
        const skip = req.pagination.page * limit - limit
        options = { limit, skip }
      }

      const reservations = await this.reservationRepository.findMany({})
        .skip(options?.skip ?? 0)
        .limit(options?.limit ?? 10)

      if (reservations.length === 0) {
        throw throwlhos.err_notFound('Nenhuma reserva encontrada', { reservations })
      }

      res.send_ok('Reservas encontradas', {
        reservations,
      })
    } catch (error) {
      next(error)
    }
  }

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id

      const reservation = await this.reservationRepository.findById(id)

      if (!reservation) {
        throw throwlhos.err_notFound('Nenhuma reserva encontrada', { reservation })
      }

      res.send_ok('Reserva encontrada', {
        reservation,
      })
    } catch (error) {
      next(error)
    }
  }

  findMyReservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user.id

      const reservations = await this.reservationRepository.findMany({ 
        $or : [
          {buyer: ObjectId(id)}, 
          {owner : ObjectId(id)}
        ]
       })

      if (reservations.length === 0) {
        throw throwlhos.err_notFound('Nenhuma reserva encontrada', { reservations })
      }

      res.send_ok('Suas reservas foram encontradas', {
        reservations,
      })
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, daysOfDuration } = req.body
      const ownerId = req.user.id

      this.rules.validate({ name }, { price }, { daysOfDuration }, { ownerId })

      const newReservation = new Reservation({
        name,
        owner: ObjectId(ownerId),
        price: Number(price),
        daysOfDuration,
      })

      const created = await this.reservationRepository.create(newReservation)
      res.send_created('Reserva criada', {
        reservation: created,
      })
    } catch (error) {
      next(error)
    }
  }

  update = async (req :Request, res : Response, next : NextFunction) => {
    try {
      const id = req.params.id
      const {price, name, daysOfDuration} = req.body

      this.rules.validate({name, isRequiredField : false}, {price, isRequiredField : false}, {daysOfDuration, isRequiredField : false})

      const update : Partial<Reservation> = {
        name, price, daysOfDuration
      }

      const reservation = await this.reservationRepository.findById(id)

      if(!reservation){
        throw throwlhos.err_notFound('Nenhuma reserva encontrada')
      }

      if(reservation.buyer){
        throw throwlhos.err_unprocessableEntity('Não é possível alterar a reserva enquanto estiver em uso')
      }

      await this.reservationRepository.updateById(id, update)

      res.send_ok('Reserva atualizada', {
        reservation
      })

    } catch (error) {
      next(error)
    }
  }

  reserve = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id
      const { id: buyer, balance } = req.user

      this.rules.validate(
        { buyer },
        { balance },
      )

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

      const reserveService = new ReserveService()

      const reservationUpdated = await reserveService.reserve(
        id,
        buyer,
        reservation.owner.toString(),
        reservation.price
      )

      if(!reservationUpdated) {
        throw throwlhos.err_internalServerError('Ocorreu um erro ao realizar a reserva', {reservation : reservationUpdated})
      }

      reservationUpdated.startedDate = new Date()
      reservationUpdated.endDate = new Date(new Date().setDate(new Date().getDate() + reservationUpdated.daysOfDuration))

      reservationUpdated.save();
      res.send_ok('Reservado com sucesso', { reservation: reservationUpdated })
    } catch (error) {
      next(error)
    } 
  }

  unlink = async(req:Request, res : Response, next : NextFunction) => {
    try {
      const id = req.params.id

      const reservation = await this.reservationRepository.findById(id)

      if(!reservation){
        throw throwlhos.err_notFound('Nenhuma reserva encontrada', {
          id
        })
      }

      if(!reservation.buyer){
        throw throwlhos.err_unprocessableEntity('A reserva ainda não foi alugada', {
          reservation
        })
      }

      const today = new Date();

      if(reservation.endDate && reservation.endDate > today){
        throw throwlhos.err_unprocessableEntity('Não é possível encerrar uma reserva com finalização pendente', {
          today,
          endDate : reservation.endDate,
        })
      }

      const unlinked = await this.reservationRepository.findOneAndUpdate(ObjectId(id), {
        buyer : null,
        startedDate : null,
        endDate : null
      })

      res.send_ok('Reserva encerrada', {
        reservation : unlinked
      })
    } catch (error) {
      next(error)
    }
  }

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string

      const deleted = await this.reservationRepository.deleteById(id)

      if (!deleted) {
        throw throwlhos.err_notFound('Reserva não encontrada', { deleted })
      }

      res.send_ok('Você excluiu sua reserva com sucesso', {
        reservation: deleted,
      })
    } catch (error) {
      next(error)
    }
  }
}
