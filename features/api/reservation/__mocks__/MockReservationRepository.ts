import { ReservationService } from '../ReservationServices.ts'
import { ReserveService } from '../../../../services/ReserveService.ts'

const reservation = {
  _id: '68efa67b69af3880b978bf57',
  name: 'Hotel Ruim Vista',
  owner: '68efa563a019f17c2c22f5ad',
  buyer: '68efa598a019f17c2c22f5b1',
  price: 1000,
  daysOfDuration: 1,
  startedDate: '2025-10-15T19:17:56.698Z',
  endDate: '2025-10-16T19:17:56.701Z',
  createdAt: '2025-10-15T13:49:47.570Z',
  updatedAt: '2025-10-15T19:17:56.705Z',
}

export class MockReservationRepository {
  findMany() {
    return Promise.resolve([{
      _id: '68efa67b69af3880b978bf57',
      name: 'Hotel Ruim Vista',
      owner: '68efa563a019f17c2c22f5ad',
      buyer: '68efa598a019f17c2c22f5b1',
      price: 1000,
      daysOfDuration: 1,
      startedDate: '2025-10-15T19:17:56.698Z',
      endDate: '2025-10-16T19:17:56.701Z',
      createdAt: '2025-10-15T13:49:47.570Z',
      updatedAt: '2025-10-15T19:17:56.705Z',
    }])
  }

  findById() {
    return Promise.resolve({
        _id: '68efa67b69af3880b978bf57',
        name: 'Hotel Ruim Vista',
        owner: '68efa563a019f17c2c22f5ad',
        buyer: '68efa598a019f17c2c22f5b1',
        price: 1,
        daysOfDuration: 1,
        startedDate: '2025-10-15T13:49:47.570Z',
        endDate: '2025-10-15T13:49:47.570Z',
        createdAt: '2025-10-15T13:49:47.570Z',
        updatedAt: '2025-10-15T19:17:56.705Z',
    })
  }

  create() {
    return Promise.resolve({
      'name': 'Nova reserva',
      'owner': '68efa563a019f17c2c22f5ad',
      'buyer': null,
      'price': 190,
      'daysOfDuration': 2,
      'startedDate': null,
      'endDate': null,
      '_id': '68f158ff5a54891ec0695eee',
      'createdAt': '2025-10-16T20:43:43.361Z',
      'updatedAt': '2025-10-16T20:43:43.361Z',
    })
  }

  findOneAndUpdate() {
    return Promise.resolve({
      'name': 'Nova reserva',
      'owner': '68efa563a019f17c2c22f5ad',
      'buyer': null,
      'price': 190,
      'daysOfDuration': 2,
      'startedDate': null,
      'endDate': null,
      '_id': '68f158ff5a54891ec0695eee',
      'createdAt': '2025-10-16T20:43:43.361Z',
      'updatedAt': '2025-10-16T20:43:43.361Z',
    })
  }

  deleteById() {
    return Promise.resolve({
      _id: '68efa67b69af3880b978bf57',
      name: 'Hotel Ruim Vista',
      owner: '68efa563a019f17c2c22f5ad',
      buyer: '68efa598a019f17c2c22f5b1',
      price: 1000,
      daysOfDuration: 1,
      startedDate: '2025-10-15T19:17:56.698Z',
      endDate: '2025-10-16T19:17:56.701Z',
      createdAt: '2025-10-15T13:49:47.570Z',
      updatedAt: '2025-10-15T19:17:56.705Z',
    })
  }

  updateOne() {
    return Promise.resolve({
      _id: '68efa67b69af3880b978bf57',
      name: 'Hotel Ruim Vista',
      owner: '68efa563a019f17c2c22f5ad',
      buyer: '68efa598a019f17c2c22f5b1',
      price: 1000,
      daysOfDuration: 1,
      startedDate: '2025-10-15T19:17:56.698Z',
      endDate: '2025-10-16T19:17:56.701Z',
      createdAt: '2025-10-15T13:49:47.570Z',
      updatedAt: '2025-10-15T19:17:56.705Z',
    })
  }

  save() {
    return Promise.resolve({
      _id: '68efa67b69af3880b978bf57',
      name: 'Hotel Ruim Vista',
      owner: '68efa563a019f17c2c22f5ad',
      buyer: '68efa598a019f17c2c22f5b1',
      price: 1000,
      daysOfDuration: 1,
      startedDate: '2025-10-15T19:17:56.698Z',
      endDate: '2025-10-16T19:17:56.701Z',
      createdAt: '2025-10-15T13:49:47.570Z',
      updatedAt: '2025-10-15T19:17:56.705Z',
    })
  }
}

export class MockReservationService extends ReservationService {
}

export class MockReserveService extends ReserveService {
}
