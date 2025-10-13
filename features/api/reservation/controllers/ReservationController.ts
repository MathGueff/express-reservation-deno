import { NextFunction, Request, Response } from 'express'
import { ReservationRepository } from '../../../../models/Reservation/ReservationRepository.ts'
import { ReservationRules } from '../ReservationRules.ts'
import { throwlhos } from '../../../../globals/Throwlhos.ts'
import { QueryOptions } from 'mongoose'
import { ApiBodyEntriesMapper } from '../../../../services/ApiBodyEntriesMapper.ts'
import { Reservation } from '../../../../models/Reservation/Reservation.ts'
import { ObjectId, StartTransaction } from '../../../../globals/Mongo.ts'
import { ExpressReservationDB } from '../../../../database/db/ExpressReservationDB.ts'
import { ReserveService } from '../../../../services/ReserveService.ts'

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

    findById = async (req : Request, res : Response, next : NextFunction) => {
        try {
            const id = req.params.id as string

            const reservation = await this.reservationRepository.findById(id)

            if(!reservation){
                throw throwlhos.err_notFound('Nenhuma reserva encontrada')
            }

            res.send_ok('reservation.success.findById', {
                reservation
            })
        } catch (error) {
            next(error);
        }
    }

    findMyReservations = async (req : Request, res : Response, next : NextFunction) => {
        try {
            const id = req.user.id as string
            const reservations = await this.reservationRepository.findMany({buyer : ObjectId(id)})

            if(reservations.length === 0){
                throw throwlhos.err_notFound('Nenhuma reserva encontrada')
            }

            res.send_ok('reservation.success.findMyReservations', {
                reservations
            })
        } catch (error) {
            next(error);
        }
    }

    create = async (req: Request, res : Response, next : NextFunction) => {
        try {
            const {name, price, daysOfDuration} = req.body;
            const ownerId = req.user.id as string

            this.rules.validate(...this.apiBodyEntriesMapper.exec({owner : ObjectId(ownerId), ...req.body}))

            const newReservation = new Reservation({
                name,
                owner : ObjectId(ownerId), 
                price : Number(price),
                daysOfDuration
            })

            const created = await this.reservationRepository.create(newReservation)
            res.send_ok('reservation.success.create',{
                reservation : created
            })
        } catch (error) {
            next(error)
        }
    }

    reserve = async (req : Request, res : Response, next : NextFunction) =>{
        const session = await StartTransaction(ExpressReservationDB)
        try {
            const id = req.params.id as string
            const buyerId = req.user.id as string;
            const buyerObjectId = ObjectId(buyerId);

            if(!buyerId)
                throw throwlhos.err_badRequest('Não foi possível fazer sua reserva, informe seu login para reservar')

            this.rules.validate({id}, ...this.apiBodyEntriesMapper.exec({buyer : buyerObjectId}))

            const reservation = await this.reservationRepository.findById(id)
    
            if(!reservation) {
                throw throwlhos.err_notFound('Reserva não encontrada')
            }
    
            if(reservation.buyer)
                throw throwlhos.err_badRequest('Desculpe, essa reserva já está em uso')
    
            if(reservation.isOwnerBuying(buyerId)){
                throw throwlhos.err_badRequest('Você não pode reservar a sua própria reserva criada')
            }
            
            const reserveService = new ReserveService()
            await reserveService.reserve(
                id, 
                buyerId, 
                reservation.owner.toString(), 
                reservation.price,
                session
            );

            await session.commitTransaction();

            const reservationUpdated = await this.reservationRepository.findById(id);

            res.send_ok('reservation.success.reserve', 
                {reservation : reservationUpdated}
            )
        } catch (error) {
            await session.abortTransaction()
            next(error)
        } finally {
            await session.endSession();
        }
    }

    remove = async (req : Request, res : Response, next : NextFunction) => {
        try {
            const id = req.params.id as string

            const deleted = await this.reservationRepository.deleteById(id)

            if(!deleted)
                throw throwlhos.err_notFound('Reserva não encontrada')

            res.send_ok('reservation.success.remove', {
                reservation : deleted
            })
        } catch (error) {
            next(error)
        }
    }
}