import { MockResponser, MockNextFunction } from '../../../globals/Stubs.ts'
import { ReservationRepository } from '../../../models/Reservation/ReservationRepository.ts'
import { ReservationController } from './ReservationController.ts'
import { ReservationService } from './ReservationServices.ts'
import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import "https://deno.land/std@0.224.0/dotenv/load.ts";

import { Request } from 'npm:express'

class MockReservationRepository{
    findById(){
        return Promise.resolve({
            id : ''
        })
    }
}

const reservationService = new ReservationService({
    reservationRepository : MockReservationRepository as unknown as ReservationRepository
})
const reservationController = new ReservationController({
    reservationService : reservationService as unknown as ReservationService
})

Deno.test('ReservationController: deve mostrar um documento de reservation', async () => {
    const mockRequest : Request = {
        id : '68efa563a019f17c2c22f5ad'
    } as unknown as Request

    const result = await reservationController.findById(mockRequest, MockResponser, MockNextFunction) as any
    console.log(result)
    assertEquals(result.message, 'Sucesso')
})
