import { NextFunction, Request, Response } from 'express'
import { ReservationRules } from '../ReservationRules.ts'
import { throwlhos } from '../../../../globals/Throwlhos.ts'
import { QueryOptions } from 'mongoose'
import { Reservation } from '../../../../models/Reservation/Reservation.ts'
import { ObjectId } from '../../../../globals/Mongo.ts'
import { ReserveService } from '../../../../services/ReserveService.ts'
import { ReservationService } from '../ReservationServices.ts'

export class ReservationController {
  private reservationService: ReservationService
  private reserveService: ReserveService 
  private rules: ReservationRules

  constructor(
    reservationService: ReservationService = new ReservationService(),
    reserveService: ReserveService = new ReserveService(),
    rules = new ReservationRules(),
  ) {
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

      const reservations = await this.reservationService.findAll(options);
      
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

     const reservation = await this.reservationService.findById(id);

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

      const reservations = await this.reservationService.findMyReservations(id)

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

      const created = await this.reservationService.create(newReservation);
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

     const reservation = await this.reservationService.update(id, update)

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

      const reservation = await this.reservationService.reserve(id, buyer, balance)

      const reservationUpdated = await this.reserveService.reserve(
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

      const unlinked = await this.reservationService.unlink(id)

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

      const deleted = await this.reservationService.remove(id)

      res.send_ok('Você excluiu sua reserva com sucesso', {
        reservation: deleted,
      })
    } catch (error) {
      next(error)
    }
  }
}
