import { NextFunction, Request, Response } from 'express'
import { ReservationRepository } from '../../../../models/Reservation/ReservationRepository.ts'
import { ReservationRules } from '../ReservationRules.ts'
import { throwlhos } from '../../../../globals/Throwlhos.ts'
import { QueryOptions } from 'mongoose'
import { Reservation } from '../../../../models/Reservation/Reservation.ts'
import { ObjectId, StartTransaction } from '../../../../globals/Mongo.ts'
import { ExpressReservationDB } from '../../../../database/db/ExpressReservationDB.ts'
import { ReserveService } from '../../../../services/ReserveService.ts'

export class ReservationController{   
    private reservationRepository: ReservationRepository;

    private rules: ReservationRules;

    constructor(
        reservationRepository: ReservationRepository = new ReservationRepository(),
        rules = new ReservationRules()
    ) {
        this.reservationRepository = reservationRepository;
        this.rules = rules;
    }

    findAll = async (req : Request, res : Response, next : NextFunction) => {
        try {
            
            let options : QueryOptions = {};
            
            if(req.pagination){
                const limit = req.pagination.limit;
                const skip = req.pagination.page * limit - limit;
                options = {limit, skip}
            }

            const reservations = await this.reservationRepository.findMany({})
                .skip(options?.skip ?? 0)
                .limit(options?.limit ?? 10)

            if(reservations.length === 0){
                throw throwlhos.err_notFound('Nenhuma reserva encontrada', {reservations})
            }

            res.send_ok('Reservas encontradas com sucesso', {
                reservations
            })
        } catch (error) {
            next(error);
        }
    }

    findById = async (req : Request, res : Response, next : NextFunction) => {
        try {
            const id = req.params.id

            const reservation = await this.reservationRepository.findById(id)

            if(!reservation){
                throw throwlhos.err_notFound('Nenhuma reserva encontrada', {reservation})
            }

            res.send_ok('Reserva encontrada com sucesso', {
                reservation
            })
        } catch (error) {
            next(error);
        }
    }

    findMyReservations = async (req : Request, res : Response, next : NextFunction) => {
        try {
            const id = req.user.id

            const reservations = await this.reservationRepository.findMany({buyer : ObjectId(id)})

            if(reservations.length === 0){
                throw throwlhos.err_notFound('Nenhuma reserva encontrada',{reservations})
            }

            res.send_ok('Suas reservas foram encontradas com sucesso', {
                reservations
            })
        } catch (error) {
            next(error);
        }
    }

    create = async (req: Request, res : Response, next : NextFunction) => {
        try {
            const {name, price, daysOfDuration} = req.body;
            const ownerId = req.user.id

            this.rules.validate({name}, {price},{daysOfDuration},{ownerId})

            const newReservation = new Reservation({
                name,
                owner: ObjectId(ownerId), 
                price : Number(price),
                daysOfDuration
            })

            const created = await this.reservationRepository.create(newReservation)
            res.send_created('Você criou sua reserva com sucesso',{
                reservation : created
            })
        } catch (error) {
            next(error)
        }
    }

    reserve = async (req : Request, res : Response, next : NextFunction) =>{
        const session = await StartTransaction(ExpressReservationDB)
        try {
            const id = req.params.id 
            const {id : buyer, balance} = req.user

            this.rules.validate(
                {buyer}, {balance}
            )

            const reservation = await this.reservationRepository.findById(id)

            if(!reservation) {
                throw throwlhos.err_notFound('Reserva não encontrada', {reservation})
            }
    
            if(reservation.buyer){
                throw throwlhos.err_unprocessableEntity('Desculpe, essa reserva já está em uso',{buyer : reservation.buyer})
            }

            if(reservation.price > balance){
                throw throwlhos.err_preconditionFailed('Sua conta não possui dinheiro suficiente para a reserva')
            }

            if(reservation.owner.toString() == buyer){
                throw throwlhos.err_badRequest('Você não pode reservar a sua própria reserva criada', {
                    buyer,
                    owner : reservation.owner
                })
            }
            
            const reserveService = new ReserveService()
            await reserveService.reserve(
                id, 
                buyer, 
                reservation.owner.toString(), 
                reservation.price,
                session
            );

            await session.commitTransaction();

            const reservationUpdated = await this.reservationRepository.findById(id);

            res.send_ok('Você fez a sua reserva com sucesso', 
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
                throw throwlhos.err_notFound('Reserva não encontrada', {deleted})

            res.send_ok('Você excluiu sua reserva com sucesso', {
                reservation : deleted
            })
        } catch (error) {
            next(error)
        }
    }
}