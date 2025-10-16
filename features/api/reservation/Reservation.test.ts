import { MockResponser, MockNextFunction } from '../../../globals/Stubs.ts'
import { ReservationRepository } from '../../../models/Reservation/ReservationRepository.ts'
import { ReservationController } from './ReservationController.ts'
import { ReservationService } from './ReservationServices.ts'
import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { Request } from 'npm:express'

class MockReservationRepository{
    findMany(){
        return Promise.resolve([{
            _id: "68efa67b69af3880b978bf57",
            name: "Hotel Ruim Vista",
            owner: "68efa563a019f17c2c22f5ad",
            buyer: "68efa598a019f17c2c22f5b1",
            price: 1000,
            daysOfDuration: 1,
            startedDate: "2025-10-15T19:17:56.698Z",
            endDate: "2025-10-16T19:17:56.701Z",
            createdAt: "2025-10-15T13:49:47.570Z",
            updatedAt: "2025-10-15T19:17:56.705Z"
        }])
    }

    findById(){
        return Promise.resolve({
            _id: "68efa67b69af3880b978bf57",
            name: "Hotel Ruim Vista",
            owner: "68efa563a019f17c2c22f5ad",
            buyer: "68efa598a019f17c2c22f5b1",
            price: 1000,
            daysOfDuration: 1,
            startedDate: "2025-10-15T19:17:56.698Z",
            endDate: "2025-10-16T19:17:56.701Z",
            createdAt: "2025-10-15T13:49:47.570Z",
            updatedAt: "2025-10-15T19:17:56.705Z"
        })
    }

    create(){
        return Promise.resolve({
            "name": "Nova reserva",
            "owner": "68efa563a019f17c2c22f5ad",
            "buyer": null,
            "price": 190,
            "daysOfDuration": 2,
            "startedDate": null,
            "endDate": null,
            "_id": "68f158ff5a54891ec0695eee",
            "createdAt": "2025-10-16T20:43:43.361Z",
            "updatedAt": "2025-10-16T20:43:43.361Z"
        })
    }
}

const reservationService = new ReservationService({
    reservationRepository : new MockReservationRepository as unknown as ReservationRepository
})

const reservationController = new ReservationController({
    reservationService : reservationService as ReservationService
})


//TESTES GET
Deno.test('ReservationController: deve mostrar todos documentos de reservation', async () => {
    const mockRequest = {} as unknown as Request
    const result = await reservationController.findAll(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Reservas encontradas')
})

Deno.test('ReservationController: deve mostrar um documento de reservation', async () => {
    const mockRequest : Request = {
        params : {reservationId : '68efa67b69af3880b978bf57'}
    } as unknown as Request
    const result = await reservationController.findById(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Reserva encontrada')
})

Deno.test('ReservationController: deve retornar as reservas do usuário passado', async () => {
    const mockRequest : Request = {
        userId : '68efa67b69af3880b978bf57'
    } as unknown as Request
    const result = await reservationController.findMyReservations(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Suas reservas foram encontradas')
})

//TESTES POST
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


//TODO : Preciso injetar o ReserveService tbm
// Deno.test('ReservationController: deve fazer a reserva de uma reservation', async () =>{
//     const mockRequest : Request = {
//         params : {
//             id : '68f0ec35c1996dc1534cff3a'
//         },
//         userId : '68efa563a019f17c2c22f5ad'
//     } as unknown as Request
//     const result = await reservationController.reserve(mockRequest, MockResponser, MockNextFunction) as any
//     assertEquals(result.message, 'Reservado com sucesso')
// })


