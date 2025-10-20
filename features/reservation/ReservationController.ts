import { NextFunction, Request, Response } from 'express'
import { ReservationRules } from './ReservationRules.ts'
import { QueryOptions } from 'mongoose'
import { Reservation } from '../../models/Reservation/Reservation.ts'
import { ObjectId } from '../../globals/Mongo.ts'
import { ReserveService } from '../../services/ReserveService.ts'
import { ReservationService } from './ReservationServices.ts'

export class ReservationController {
  private reservationService: ReservationService
  private reserveService: ReserveService
  private rules: ReservationRules

  constructor({
    reservationService = new ReservationService(),
    reserveService = new ReserveService(),
    rules = new ReservationRules(),
  } = {}) {
    this.reservationService = reservationService
    this.reserveService = reserveService
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

      const reservations = await this.reservationService.findAll(options)

      return res.send_ok('Reservas encontradas', {
        reservations,
      })
    } catch (error) {
      next(error)
      return error
    }
  }

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.reservationId

      const reservation = await this.reservationService.findById(id)

      return res.send_ok('Reserva encontrada', {
        reservation,
      })
    } catch (error) {
      next(error)
      return error
    }
  }

  findMyReservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.userId

      const reservations = await this.reservationService.findMyReservations(id)

      return res.send_ok('Suas reservas foram encontradas', {
        reservations,
      })
    } catch (error) {
      next(error)
      return error
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, daysOfDuration } = req.body
      const ownerId = req.userId

      this.rules.validate({ name }, { price }, { daysOfDuration }, { ownerId })

      const newReservation = new Reservation({
        name,
        owner: ObjectId(ownerId),
        price: Number(price),
        daysOfDuration,
      })

      const created = await this.reservationService.create(newReservation)
      return res.send_created('Reserva criada', {
        reservation: created,
      })
    } catch (error) {
      next(error)
      return error
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.reservationId
      const { price, name, daysOfDuration } = req.body

      this.rules.validate({ name, isRequiredField: false }, { price, isRequiredField: false }, { daysOfDuration, isRequiredField: false })

      const update: Partial<Reservation> = {
        name,
        price,
        daysOfDuration,
      }

      const reservation = await this.reservationService.update(id, update)

      return res.send_ok('Reserva atualizada', {
        reservation,
      })
    } catch (error) {
      next(error)
      return error
    }
  }

  reserve = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.reservationId
      const buyer = req.userId

      this.rules.validate(
        { buyer },
      )

      const reservation = await this.reservationService.reserve(id, buyer)

      const reserved = await this.reserveService.reserve(
        id,
        buyer,
        reservation.owner.toString(),
        reservation.price,
      )

      return res.send_ok('Reservado com sucesso', { reservation: reserved })
    } catch (error) {
      next(error)
      return error
    }
  }

  unlink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.reservationId

      const unlinked = await this.reservationService.unlink(id)

      return res.send_ok('Reserva encerrada', {
        reservation: unlinked,
      })
    } catch (error) {
      next(error)
      return error
    }
  }

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.reservationId

      const deleted = await this.reservationService.remove(id)

      return res.send_ok('Reserva removida', {
        reservation: deleted,
      })
    } catch (error) {
      next(error)
      return error
    }
  }
}
