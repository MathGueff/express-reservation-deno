import { Router } from 'express'
import { ReservationController } from './controllers/ReservationController.ts'
import { PaginationMiddle } from '../../../middlewares/PaginationMiddle.ts'
import { AuthMiddle } from '../../../middlewares/AuthMiddle.ts'

const ReservationRouter = Router()

const reservationController = new ReservationController();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     jwtAuth:
 *       type: apikey
 *       in: header
 *       name: Authorization
 * /api/reservation:
 *   get:
 *     security:
 *       - jwtAuth: []
 *     summary: Busca todas as reservas com paginação
 *     tags: [Reservation]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Número da página (default = 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         required: false
 *         description: Quantidade de reservas por página (default = 10)
 *     responses:
 *       200:
 *         description: Lista de reservas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *       400:
 *         description: Parâmetros inválidos
 */
ReservationRouter.get(
    '/api/reservation',
    AuthMiddle,
    PaginationMiddle({maxLimit : 10}),
    reservationController.findAll
)


/**
 * @openapi
 * /api/reservation/my:
 *   get:
 *     summary: Busca reservas do usuário
 *     tags: [Reservation]
 *     responses:
 *       200:
 *         description: reservas encontradas
 *       404:
 *         description: reserva não encontrada
 */
ReservationRouter.get(
    '/api/reservation/my',
    AuthMiddle,
    reservationController.findMyReservations
)


/**
 * @openapi
 * /api/reservation/{id}:
 *   get:
 *     summary: Busca reserva por ID
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: reserva encontrada
 *       404:
 *         description: reserva não encontrada
 */
ReservationRouter.get(
    '/api/reservation/:id',
    AuthMiddle,
    PaginationMiddle(),
    reservationController.findById
)

/**
 * @openapi
 * /api/reservation:
 *   post:
 *     summary: Cria uma nova reserva
 *     tags: [Reservation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               daysOfDuration:
 *                 type: number
 *     responses:
 *       201:
 *         description: Reserva criada
 */
ReservationRouter.post(
    '/api/reservation',
    AuthMiddle,
    reservationController.create
)

/**
 * @openapi
 * /api/reservation/reserve/{id}:
 *   put:
 *     summary: Faz a reserva para um usuário
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Reserva realizada
 *       400:
 *         description: Reserva já existente
 *       404:
 *         description: Reserva não encontrada
 */
ReservationRouter.post(
    '/api/reservation/reserve/:id',
    AuthMiddle,
    reservationController.reserve
)

/**
 * @openapi
 * /api/reservation/{id}:
 *   delete:
 *     summary: Remove reserva por ID
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Reserva removida
 *       404:
 *         description: Reserva não encontrada
 */
ReservationRouter.delete(
    '/api/reservation/:id',
    AuthMiddle,
    reservationController.remove
)

export {ReservationRouter}