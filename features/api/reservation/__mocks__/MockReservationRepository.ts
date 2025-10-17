import { ReservationService } from '../ReservationServices.ts'
import { ReserveService } from '../../../../services/ReserveService.ts'
import { IReservation } from '../../../../models/Reservation/IReservation.ts'
import { Reservation } from '../../../../models/Reservation/Reservation.ts'
import { ObjectId } from '../../../../globals/Mongo.ts'
import { ISODate } from '../../../../utilities/static/Time.ts'

const reservations: Array<Partial<IReservation>> = [
  {
    _id: ObjectId('68efa67b69af3880b978bf57'),
    name: 'Hotel Ruim Vista',
    owner: ObjectId('68efa563a019f17c2c22f5ad'),
    buyer: ObjectId('68efa598a019f17c2c22f5b1'),
    price: 1000,
    daysOfDuration: 1,
    startedDate: ISODate('2025-10-15T19:17:56.698Z'),
    endDate: ISODate('2025-10-16T19:17:56.701Z'),
  },
  {
    _id: ObjectId('68f003456320cc0715fc6a32'),
    name: "Hotel Galo Roxo",
    buyer: ObjectId('68efa563a019f17c2c22f5ad'),
    price: 2,
    daysOfDuration: 1,
  },
]

export class MockReservationRepository {
  private mockData: Array<Partial<IReservation>> = []
  private mockRestrictionClasses: Array<Reservation> = []

  constructor() {
    this.setMockData(reservations)
  }

  setMockData(data: Partial<IReservation> | Array<Partial<IReservation>>) {
    if (Array.isArray(data)) {
      this.mockData = data
      this.mockRestrictionClasses = data.map((item) => new Reservation(item as IReservation))
    } else {
      this.mockData = [data]
      this.mockRestrictionClasses = [new Reservation(data as IReservation)]
    }
  }

  // Clear mock data
  clearMockData() {
    this.mockData = []
    this.mockRestrictionClasses = []
  }

  // Mock implementations of repository methods
  async findToReport(id: string) {
    let results = this.mockData.filter(item => item._id?.equals(id))

    return results
  }

  async findOne(query: any): Promise<Reservation | null> {
    if (query.id) {
      query._id = query.id
      delete query.id
    }

    const found = this.mockData.find((item) => {
      return Object.keys(query).every((key) => {
        if (key === '_id') return item._id?.equals(query._id)
        return item[key as keyof Reservation] === query[key]
      })
    })

    return found ? new Reservation(found as Reservation) : null
  }

  // Helper methods for testing
  getMockData(): Array<Partial<Reservation>> {
    return this.mockData
  }

  getMockRestrictionClasses(): Array<Reservation> {
    return this.mockRestrictionClasses
  }

  findMany() {
    return Promise.resolve(this.getMockData())
  }

   findById(id : string) {
    return Promise.resolve(this.findOne({id}))
  }


  create() {
    return Promise.resolve(this.getMockData())
  }

  findOneAndUpdate() {
    return Promise.resolve(this.getMockData())
  }

  deleteById() {
    return Promise.resolve(this.getMockData())
  }

  updateOne() {
    return Promise.resolve(this.getMockData())
  }

  save() {
    return Promise.resolve(this.getMockData())
  }
}

export class MockReservationService extends ReservationService {
}

export class MockReserveService extends ReserveService {
}
