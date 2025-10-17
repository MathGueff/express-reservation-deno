import { MockResponser, MockNextFunction } from '../../../globals/Stubs.ts'
import { ReservationRepository } from '../../../models/Reservation/ReservationRepository.ts'
import { MockReservationRepository, MockReservationService, MockReserveService } from './__mocks__/MockReservationRepository.ts'
import { ReservationController } from './ReservationController.ts'
import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { Request } from 'npm:express'

const reservationService = new MockReservationService({
    reservationRepository : new MockReservationRepository as unknown as ReservationRepository
})

const reserveService = new MockReserveService({
    reservationRepository : new MockReservationRepository as unknown as ReservationRepository
})

const reservationController = new ReservationController({
    reservationService,
    reserveService
})

//GET List
Deno.test('ReservationController: deve mostrar todos documentos de reservation', async () => {
    const mockRequest = {} as unknown as Request
    const result = await reservationController.findAll(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Reservas encontradas')
})

//GET By Id
Deno.test('ReservationController: deve mostrar um documento de reservation', async () => {
    const mockRequest : Request = {
        params : {reservationId : '68efa67b69af3880b978bf57'}
    } as unknown as Request
    const result = await reservationController.findById(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Reserva encontrada')
})

//GET my reservations
Deno.test('ReservationController: deve retornar as reservas do usuário passado', async () => {
    const mockRequest : Request = {
        userId : '68efa67b69af3880b978bf57'
    } as unknown as Request
    const result = await reservationController.findMyReservations(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Suas reservas foram encontradas')
})

//POST create
Deno.test('ReservationController: deve criar um novo documento de reservation', async () => {
    const mockRequest : Request = {
        body : {
            name : 'Nova reserva',
            price : 190,
            daysOfDuration : 2,
        },
        userId : '68efa563a019f17c2c22f5ad'
    } as unknown as Request
    const result = await reservationController.create(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Reserva criada')
})


//POST unlink
Deno.test('ReservationController: deve liberar a reserva que não está mais ocupada', async () => {
     const mockRequest : Request = {
        params : {
            reservationId : '68efa67b69af3880b978bf57'
        }
    } as unknown as Request
    const result = await reservationController.unlink(mockRequest, MockResponser, MockNextFunction) as any
    console.log(result)
    assertEquals(result.message, 'Reserva encerrada')
})

//DELETE remove
Deno.test('ReservationController: deve remover uma reserva', async () => {
    const mockRequest : Request = {
        params : {
            reservationId : '68efa67b69af3880b978bf57'
        }
    } as unknown as Request

    const result = await reservationController.remove(mockRequest,MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Reserva removida')
})

//TODO : Preciso injetar o ReserveService tbm
// Deno.test('ReservationController: deve fazer a reserva de uma reservation', async () =>{
//     const mockRequest : Request = {
//         params : {
//             reservationId : '68f0ec35c1996dc1534cff3a'
//         },
//         userId : '68efa598a019f17c2c22f5b1'
//     } as unknown as Request
//     const result = await reservationController.reserve(mockRequest, MockResponser, MockNextFunction) as any
//     console.log(result)
//     assertEquals(result.message, 'Reservado com sucesso')
// })


