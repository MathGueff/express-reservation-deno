import { Response, Router } from 'express'
import { ReservationController } from './controllers/ReservationController.ts'
import { PaginationMiddle } from '../../../middlewares/PaginationMiddle.ts'
import { AuthMiddle } from '../../../middlewares/AuthMiddle.ts'

const ReservationRouter = Router()

const reservationController = new ReservationController();

ReservationRouter.get(
    '/api/reservation',
    AuthMiddle,
    PaginationMiddle({maxLimit : 10}),
    reservationController.findAll
)

ReservationRouter.post(
    '/api/reservation',
    AuthMiddle,
    reservationController.create
)

ReservationRouter.post(
    '/api/reservation/reserve/:id',
    AuthMiddle,
    reservationController.reserve
)

export {ReservationRouter}