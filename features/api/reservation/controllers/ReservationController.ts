import { NextFunction, Request, Response } from 'express'
import { ReservationRepository } from '../../../../models/Reservation/ReservatioRepository.ts'
import { ReservationRules } from '../ReservationRules.ts'
import { throwlhos } from '../../../../globals/Throwlhos.ts'
import { QueryOptions } from 'mongoose'
import { IReservation } from '../../../../models/Reservation/IReservation.ts'
import { ApiBodyEntriesMapper } from '../../../../services/ApiBodyEntriesMapper.ts'
import { Reservation } from '../../../../models/Reservation/Reservation.ts'

export class ReservationController{   
    private reservationRepository: ReservationRepository;
    private apiBodyEntriesMapper : ApiBodyEntriesMapper<Partial<Reservation>>

    private rules: ReservationRules;

    constructor(
        reservationRepository: ReservationRepository = new ReservationRepository(),
        rules = new ReservationRules()
    ) {
        this.reservationRepository = reservationRepository;
        this.rules = rules;
        this.apiBodyEntriesMapper = new ApiBodyEntriesMapper()
    }

    findAll = async (req : Request, res : Response, next : NextFunction) => {
        try {
            
            let options : QueryOptions = {};
            
            if(req.pagination){
                const limit = req.pagination.limit;
                const skip = req.pagination.page * limit - limit;
                options = {limit, skip}
            }

            const reservations = await this.reservationRepository.findReservationWithPagination(options)

            if(reservations.length === 0){
                throw throwlhos.err_notFound('Nenhuma reserva encontrada')
            }

            res.send_ok('reservation.success.getAll', {
                reservations
            })
        } catch (error) {
            next(error);
        }
    }

    create = async (req: Request, res : Response, next : NextFunction) => {
        try {
            const {owner, price} = req.body;
            this.rules.validate(...this.apiBodyEntriesMapper.exec({owner, price}))
            await this.reservationRepository.create({owner, price})
            res.send_ok('reservation.success.create',{
                data : req.body
            })
        } catch (error) {
            next(error)
        }
    }

    reserve = async (req : Request, res : Response, next : NextFunction) =>{
        try {
            const id = req.params.id as string
            const {buyer} = req.body as IReservation;

            this.rules.validate({id}, ...this.apiBodyEntriesMapper.exec({buyer}))

            const reservation = await this.reservationRepository.findById(id)
            res.send_ok('reservation.success.reserve', {
                reservation
            })
        } catch (error) {
            next(error)
        }
    }
}