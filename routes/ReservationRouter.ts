import { Router } from 'express'
import { ReservationRouter as Routes } from '../features/reservation/ReservationRouter.ts'

export const ReservationRouter = Router()

ReservationRouter.use(Routes)
