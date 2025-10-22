import { UpdateQuery } from 'mongoose'
import { ObjectId } from '../../../globals/Mongo.ts'
import { IUser } from '../../../models/User/IUser.ts'
import { IUserFilter, User } from '../../../models/User/User.ts'
import { ISODate } from '../../../utilities/static/Time.ts'

class MockUserRepository {
  public mockData: Array<Partial<IUser>> = [{
    _id: ObjectId('68efa563a019f17c2c22f5ad'),
    name: 'Matheus Gueff',
    email: 'gueff@gmail.com',
    password: '$2b$10$4gdsCm0u6tk0pJDAtCWdreMaM8IPVRoF73pr.ynvEbpuVaY2bm6Ou',
    balance: 3353,
    createdAt: ISODate('2025-10-15T13:45:07.996Z'),
    updatedAt: ISODate('2025-10-17T20:23:09.394Z'),
  },
  {
    _id: ObjectId('68efa598a019f17c2c22f5b1'),
    name: 'Davy Ribeiro',
    email: 'davy@gmail.com',
    password: '$2b$10$SvpOCT5YBbnVXL7WzrUl7uj/i/B3JrnL4y8C67eq.o2.yv8gKhUvS',
    balance: 496798,
    createdAt: ISODate('2025-10-15T13:46:00.178Z'),
    updatedAt: ISODate('2025-10-17T20:23:09.382Z'),
  },]
  private mockRestrictionClasses: Array<User> = []

  // Set mock data for tests
  setMockData(data: Partial<IUser> | Array<Partial<IUser>>) {
    if (Array.isArray(data)) {
      this.mockData = data
      this.mockRestrictionClasses = data.map((item) => new User(item as IUser))
    } else {
      this.mockData = [data]
      this.mockRestrictionClasses = [new User(data as IUser)]
    }
  }

  // Clear mock data
  clearMockData() {
    this.mockData = []
    this.mockRestrictionClasses = []
  }

  // Helper methods for testing
  public getMockData(): Array<Partial<IUser>> {
    return this.mockData
  }

  getMockRestrictionClasses(): Array<User> {
    return this.mockRestrictionClasses
  }

  async findOne(query: any): Promise<IUser | null> {
    if (query.id) {
      query._id = query.id
      delete query.id
    }

    const found = this.mockData.find((item) => {
      return Object.keys(query).every((key) => {
        if (key === '_id') return item._id?.equals(query._id)
        return item[key as keyof IUser] === query[key]
      })
    })

    return found ? new User(found as IUser) : null
  }

  async findManyWithFilter(filter: IUserFilter) {
    // Apply skip and limit
    const skip = filter.skip || 0
    const limit = filter.limit || 10
    return Promise.resolve(
      this.mockData.slice(skip, skip + limit) as Array<IUser>,
    )
  }

  create(user : IUser) {
    const newUser = this.mockData.push(user)
    return Promise.resolve(this.getMockData()[newUser - 1])
  }

  updateById(id: string, data : {$set : Partial<User>}) {
    const userIndex = this.getMockData().findIndex(u => String(u._id) === String(id))
    if(userIndex === -1) {
      return null
    }
    
    this.mockData[userIndex] = {...this.mockData[userIndex], ...data.$set}
    return Promise.resolve(this.findOne({id}))
  }

  deleteOne(id: string) {
    return Promise.resolve(this.findOne(id))
  }

  findById(id: string) {
    return Promise.resolve(this.findOne({id}))
  }
}

export { MockUserRepository }
