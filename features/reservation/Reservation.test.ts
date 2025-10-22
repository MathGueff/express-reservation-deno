import { MockNextFunction, MockResponser } from '../../globals/Stubs.ts'
import { ReservationRepository } from '../../models/Reservation/ReservationRepository.ts'
import { MockReservationRepository} from './__mocks__/MockReservationRepository.ts'
import { ReservationController } from './ReservationController.ts'
import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { Request } from 'npm:express'
import { MockReservationService } from './__mocks__/MockReservationService.ts'
import { defaultAssert, PayloadType } from '../../globals/TestAssert.ts'
import { ObjectId } from '../../globals/Mongo.ts'
import { ISODate } from '../../utilities/static/Time.ts'
import { TransactionReservationService } from './services/TransactionReservationService.ts'

const reservationMockRepository = new MockReservationRepository();

const reservationService = new MockReservationService({
  reservationRepository : reservationMockRepository as unknown as ReservationRepository
})

const transactionReservationService = new TransactionReservationService({
  reservationRepository : reservationMockRepository as unknown as ReservationRepository
})

const reservationController = new ReservationController({
  reservationService,
  transactionReservationService
})

// GET List
Deno.test('ReservationController: deve mostrar todos documentos de reservation', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {} as unknown as Request
  const received = await reservationController.findAll(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Reservas encontradas',
    code: 200,
    status: 'OK',
    data: {
      reservations : reservationMockRepository.getMockData()
    }
  })
})

//GET List
Deno.test(
  'ReservationController: deve exibir erro ao procurar todos documentos de reservation',
  { sanitizeOps: false, sanitizeResources: false },
  async () => {
    const mockRequest = {
      pagination: {
        limit: 10,
        page: 500,
      },
    } as unknown as Request
    const received = await reservationController.findAll(mockRequest, MockResponser, MockNextFunction) as any
    defaultAssert(received, PayloadType.errorPayload, {
      message: 'Nenhuma reserva encontrada',
      code: 404,
      status: 'NOT_FOUND',
    })
  },
)

//GET By Id
Deno.test('ReservationController: deve mostrar um documento de reservation', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: { reservationId: '68efa67b69af3880b978bf57' },
  } as unknown as Request
  const received = await reservationController.findById(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Reserva encontrada',
    code: 200,
    status: 'OK',
    data : {
      reservation : {
        name: 'Hotel Ruim Vista',
        owner: ObjectId('68efa563a019f17c2c22f5ad'),
        buyer: ObjectId('68efa598a019f17c2c22f5b1'),
        price: 1000,
        daysOfDuration: 1,
        startedDate: ISODate('2025-10-15T19:17:56.698Z'),
        endDate: ISODate('2025-10-16T19:17:56.701Z'),
    }}
  })
})

//GET By Id
Deno.test(
  'ReservationController: deve exibir um erro ao procurar por um documento de reservation',
  { sanitizeOps: false, sanitizeResources: false },
  async () => {
    const mockRequest: Request = {
      params: { reservationId: '68f25cda82fb9962383815c5' },
    } as unknown as Request
    const received = await reservationController.findById(mockRequest, MockResponser, MockNextFunction) as any
    defaultAssert(received, PayloadType.errorPayload, {
      message: 'Nenhuma reserva encontrada',
      code: 404,
      status: 'NOT_FOUND',
    })
  },
)

//GET my reservations
Deno.test('ReservationController: deve retornar as reservas do usuário passado', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    userId: '68efa563a019f17c2c22f5ad',
  } as unknown as Request
  const received = await reservationController.findMyReservations(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(received.message, 'Suas reservas foram encontradas')
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Suas reservas foram encontradas',
    code: 200,
    status: 'OK',
    data : {
      reservations : reservationMockRepository.getMockData().filter(r => r.buyer?.equals(mockRequest.userId) || r.owner?.equals(mockRequest.userId))
    }
  })
})

//GET my reservations
Deno.test('ReservationController: deve retornar erro ao procurar com um ID inválido', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    userId: '68f28d78cb21901c2575ad23',
  } as unknown as Request
  const received = await reservationController.findMyReservations(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.errorPayload, {
    message: 'Nenhuma reserva encontrada',
    code: 404,
    status: 'NOT_FOUND',
  })
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
  const received = await reservationController.create(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Reserva criada',
    code: 201,
    status: 'CREATED',
    data : {
      reservation : reservationMockRepository.getMockData()[3]
    }
  })
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
  const received = await reservationController.create(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.errorPayload, {
    message: 'Campos inválidos',
    code: 422,
    status: 'BAD_REQUEST',
  })
})

//POST unlink
Deno.test('ReservationController: deve liberar a reserva que não está mais ocupada', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      reservationId: '68efa67b69af3880b978bf57',
    },
  } as unknown as Request
  const received = await reservationController.unlink(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Reserva encerrada',
    code: 200,
    status: 'OK',
    data : {
      reservation : {
        name: 'Hotel Ruim Vista',
        owner: ObjectId('68efa563a019f17c2c22f5ad'),
        buyer: ObjectId('68efa598a019f17c2c22f5b1'),
        price: 1000,
        daysOfDuration: 1,
        startedDate: ISODate('2025-10-15T19:17:56.698Z'),
        endDate: ISODate('2025-10-16T19:17:56.701Z'),
      }
    }
  })
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
    const received = await reservationController.unlink(mockRequest, MockResponser, MockNextFunction) as any
    defaultAssert(received, PayloadType.errorPayload, {
      message: 'Não é possível encerrar uma reserva com finalização pendente',
      code: 422,
      status: 'UNPROCESSABLE_ENTITY',
    })
  },
)

Deno.test('ReservationController: deve atualizar uma reserva', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      reservationId: '68f003456320cc0715fc6a32',
    },
    body: {
      price: 232,
    },
  } as unknown as Request

  const received = await reservationController.update(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Reserva atualizada',
    code: 200,
    status: 'OK',
    data : {
      reservation : {
        name: 'Hotel Galo Roxo',
        owner: ObjectId('68efa563a019f17c2c22f5ad'),
        price: 2,
        daysOfDuration: 1,
      }
    }
  })
})

Deno.test(
  'ReservationController: deve exibir erro ao tentar editar uma reserva em uso',
  { sanitizeOps: false, sanitizeResources: false },
  async () => {
    const mockRequest: Request = {
      params: {
        reservationId: '68efa67b69af3880b978bf57',
      },
      body: {
        price: 232,
      },
    } as unknown as Request

    const received = await reservationController.update(mockRequest, MockResponser, MockNextFunction) as any
    defaultAssert(received, PayloadType.errorPayload, {
      message: 'Não é possível alterar a reserva enquanto estiver em uso',
      code: 422,
      status: 'UNPROCESSABLE_ENTITY',
    })
  },
)

//DELETE remove
Deno.test('ReservationController: deve remover uma reserva', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      reservationId: '68efa67b69af3880b978bf57',
    },
  } as unknown as Request

  const received = await reservationController.remove(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Reserva removida',
    code: 200,
    status: 'OK',
    data : {
      reservation : {
        name: 'Hotel Ruim Vista',
        owner: ObjectId('68efa563a019f17c2c22f5ad'),
        buyer: ObjectId('68efa598a019f17c2c22f5b1'),
        price: 1000,
        daysOfDuration: 1,
        startedDate: ISODate('2025-10-15T19:17:56.698Z'),
        endDate: ISODate('2025-10-16T19:17:56.701Z'),
      }
    }
  })
})

//DELETE remove
Deno.test('ReservationController: deve exibir erro ao tentar remover uma reserva', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      reservationId: '68f25cda82fb9962383815c5',
    },
  } as unknown as Request

  const received = await reservationController.remove(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.errorPayload, {
    message: 'Reserva não encontrada',
    code: 404,
    status: 'NOT_FOUND',
  })
})

Deno.test('ReservationController: deve fazer a reserva de uma reservation', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      reservationId: '68f003456320cc0715fc6a32',
    },
    userId: '68efa598a019f17c2c22f5b1',
  } as unknown as Request
  const received = await reservationController.reserve(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Reservado com sucesso',
    code: 200,
    status: 'OK',
    data : {
      reservation : {
        name: 'Hotel Galo Roxo',
        owner: ObjectId('68efa563a019f17c2c22f5ad'),
        price: 2,
        daysOfDuration: 1,
      }
    }
  })
})

Deno.test('ReservationController: deve exibir erro ao fazer a reserva de uma reservation já ocupada', {
  sanitizeOps: false,
  sanitizeResources: false,
}, async () => {
  const mockRequest: Request = {
    params: {
      reservationId: '68efa67b69af3880b978bf57',
    },
    userId: '68efa598a019f17c2c22f5b1',
  } as unknown as Request
  const received = await reservationController.reserve(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.errorPayload, {
    message: 'A reserva já está em uso',
    code: 422,
    status: 'UNPROCESSABLE_ENTITY',
  })
})
