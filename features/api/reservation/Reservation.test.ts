import mongooseAggregatePaginate from 'npm:mongoose-aggregate-paginate-v2'
import { MockNextFunction, MockResponser } from '../../../globals/Stubs.ts'
import { ReservationRepository } from '../../../models/Reservation/ReservationRepository.ts'
import { MockReservationRepository, MockReservationService, MockReserveService } from './__mocks__/MockReservationRepository.ts'
import { ReservationController } from './ReservationController.ts'
import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { Request } from 'npm:express'

const reservationService = new MockReservationService({
  reservationRepository: new MockReservationRepository() as unknown as ReservationRepository,
})

const reserveService = new MockReserveService({
  reservationRepository: new MockReservationRepository() as unknown as ReservationRepository,
})

const reservationController = new ReservationController({
  reservationService,
  reserveService,
})

//GET List
Deno.test('ReservationController: GET deve mostrar todos documentos de reservation', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {} as unknown as Request
  const result = await reservationController.findAll(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Reservas encontradas')
})

//GET By Id
Deno.test('ReservationController: deve mostrar um documento de reservation', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: { reservationId: '68efa67b69af3880b978bf57' },
  } as unknown as Request
  const result = await reservationController.findById(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Reserva encontrada')
})

//GET By Id
Deno.test(
  'ReservationController: deve exibir um erro ao procurar por um documento de reservation',
  { sanitizeOps: false, sanitizeResources: false },
  async () => {
    const mockRequest: Request = {
      params: { reservationId: '68f25cda82fb9962383815c5' },
    } as unknown as Request
    const result = await reservationController.findById(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Nenhuma reserva encontrada')
  },
)

//GET my reservations
Deno.test('ReservationController: deve retornar as reservas do usuário passado', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    userId: '68efa563a019f17c2c22f5ad',
  } as unknown as Request
  const result = await reservationController.findMyReservations(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Suas reservas foram encontradas')
})

//GET my reservations
Deno.test('ReservationController: deve retornar erro ao procurar com um ID inválido', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    userId: '68f28d78cb21901c2575ad23',
  } as unknown as Request
  const result = await reservationController.findMyReservations(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Suas reservas foram encontradas')
})

//POST create
Deno.test('ReservationController: deve criar um novo documento de reservation', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    body: {
      name: 'Nova reserva',
      price: 190,
      daysOfDuration: 2,
    },
    userId: '68efa563a019f17c2c22f5ad',
  } as unknown as Request
  const result = await reservationController.create(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Reserva criada')
})

//POST create
Deno.test('ReservationController: deve retornar erro ao tentar criar um novo documento de reservation', {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  const mockRequest: Request = {
    body: {
      name: 2342,
      price: '190',
      daysOfDuration: 0,
    },
    userId: '68efa563a019f17c2c22f5ad',
  } as unknown as Request
  const result = await reservationController.create(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Campos inválidos')
})

//POST unlink
Deno.test('ReservationController: deve liberar a reserva que não está mais ocupada', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      reservationId: '68efa67b69af3880b978bf57',
    },
  } as unknown as Request
  const result = await reservationController.unlink(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Reserva encerrada')
})

//POST unlink
Deno.test(
  'ReservationController: deve retornar um erro ao tentar remover a reserva em andamento',
  { sanitizeOps: false, sanitizeResources: false },
  async () => {
    const mockRequest: Request = {
      params: {
        reservationId: '68f0ec35c1996dc1534cff3a',
      },
    } as unknown as Request
    const result = await reservationController.unlink(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Não é possível encerrar uma reserva com finalização pendente')
  },
)

Deno.test('ReservationController: deve atualizar uma reserva', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      reservationId: '68f003456320cc0715fc6a32',
    },
    body: {
      price : 232
    }
  } as unknown as Request

  const result = await reservationController.update(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Reserva atualizada')
})

Deno.test('ReservationController: deve exibir erro ao tentar editar uma reserva em uso', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      reservationId: '68efa67b69af3880b978bf57',
    },
    body: {
      price : 232
    }
  } as unknown as Request

  const result = await reservationController.update(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Não é possível alterar a reserva enquanto estiver em uso')
})

//DELETE remove
Deno.test('ReservationController: deve remover uma reserva', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      reservationId: '68efa67b69af3880b978bf57',
    },
  } as unknown as Request

  const result = await reservationController.remove(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Reserva removida')
})

//DELETE remove
Deno.test('ReservationController: deve exibir erro ao tentar remover uma reserva', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      reservationId: '68f25cda82fb9962383815c5',
    },
  } as unknown as Request

  const result = await reservationController.remove(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Reserva não encontrada')
})

//TODO : Preciso injetar o ReserveService tbm
// Deno.test('ReservationController: deve fazer a reserva de uma reservation',{ sanitizeOps : false, sanitizeResources : false} ,  async () =>{
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
