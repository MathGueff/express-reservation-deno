import { Types, QueryOptions } from 'mongoose'
import { UserService } from '../UserService.ts'
import { IUser } from '../../../../models/User/IUser.ts'
import { User } from '../../../../models/User/User.ts'
import { ObjectId } from '../../../../globals/Mongo.ts'
import { ISODate } from '../../../../utilities/static/Time.ts'

const user : Partial<IUser> = {
   "_id": ObjectId("68efa598a019f17c2c22f5b1"),
    "name": "Davy Ribeiro",
    "email": "davy@gmail.com",
    "password": "$2b$10$SvpOCT5YBbnVXL7WzrUl7uj/i/B3JrnL4y8C67eq.o2.yv8gKhUvS",
    "balance": 150,
    "createdAt": ISODate("2025-10-15T13:46:00.178Z"),
    "updatedAt": ISODate("2025-10-17T13:29:26.086Z") 
}

export class MockUserRepository {
  private mockData: Array<Partial<IUser>> = []
  private mockRestrictionClasses: Array<User> = []

   constructor(){
    this.setMockData(user)
   }

  setMockData (data: Partial<IUser> | Array<Partial<IUser>>) {
    if (Array.isArray(data)) {
      this.mockData = data
      this.mockRestrictionClasses = data.map(item => new User(item as IUser))
    } else {
      this.mockData = [data]
      this.mockRestrictionClasses = [new User(data as IUser)]
    }
  }

  // Clear mock data
  clearMockData () {
    this.mockData = []
    this.mockRestrictionClasses = []
  }

  // Mock implementations of repository methods
  async findToReport (id : string) {
    let results = this.mockData.filter(item => item._id?.equals(id))

    return results
  }

  async findOne (query: any): Promise<User | null> {
    if (query.id) {
      query._id = query.id
      delete query.id
    }

    const found = this.mockData.find(item => {
      return Object.keys(query).every(key => {
        if (key === '_id') return item._id?.equals(query._id)
        return item[key as keyof User] === query[key]
      })
    })

    return found ? new User(found as User) : null
  }

  // Helper methods for testing
  getMockData (): Array<Partial<User>> {
    return this.mockData
  }

  getMockRestrictionClasses (): Array<User> {
    return this.mockRestrictionClasses
  }

  findMany(){
    return Promise.resolve(
      this.getMockData()
    )
  }

  findById(id: string | Types.ObjectId, options?: QueryOptions){
    if(user._id === id){
      return Promise.resolve({
        user  
      })
    }
    else{
      return Promise.resolve(null)
    }
  }

  create(){
    return Promise.resolve({

    })
  }

  deleteOne(){
    return Promise.resolve({

    })
  }

  updateOne(){
    return Promise.resolve({

    })
  }
  
}

export class MockUserService extends UserService {
}
