import { Router } from 'express';
import { ReservationRouter as Routes } from '../features/api/reservation/ReservationRouter.ts';

export const ReservationRouter = Router();

ReservationRouter.use(Routes)