import { ObjectId } from '../../../globals/Mongo.ts'
import { throwlhos } from '../../../globals/Throwlhos.ts'
import { AuthRepository } from '../../../models/Auth/AuthRepository.ts'
import { IUser } from '../../../models/User/IUser.ts'
import { IUserFilter } from '../../../models/User/User.ts'
import { ISODate } from '../../../utilities/static/Time.ts'
import { AuthService } from '../AuthService.ts'

const users: Array<Partial<IUser>> = [
  {
    _id: ObjectId('68efa563a019f17c2c22f5ad'),
    name: 'Matheus Gueff',
    email: 'matheus@gmail.com',
    password: '$2b$10$SvpOCT5YBbnVXL7WzrUl7uj/i/B3JrnL4y8C67eq.o2.yv8gKhUvS',
    balance: 150,
    createdAt: ISODate('2025-10-15T13:46:00.178Z'),
    updatedAt: ISODate('2025-10-17T13:29:26.086Z'),
  },
  {
    _id: ObjectId('68efa598a019f17c2c22f5b1'),
    name: 'Davy Ribeiro',
    email: 'davy@gmail.com',
    password: '$2b$10$SvpOCT5YBbnVXL7WzrUl7uj/i/B3JrnL4y8C67eq.o2.yv8gKhUvS',
    balance: 500000,
    createdAt: ISODate('2025-10-15T13:46:00.178Z'),
    updatedAt: ISODate('2025-10-17T15:52:01.489Z'),
  },
]

export class MockAuthRepository {
  findById(id: string) {
    const user = users.filter((u) => u._id?.toString() == id).at(0)
    return Promise.resolve(user)
  }
  findOne(filters: IUserFilter) {
    const user = users.filter((u) => u.email == filters.email).at(0)
    return Promise.resolve(user)
  }
  updateById(id : string) {
    return Promise.resolve(this.findById(id))
  }
}

export class MockAuthService extends AuthService {

  constructor({ authRepository = new MockAuthRepository() } = {}) {
    super()
    this.authRepository = authRepository as unknown as AuthRepository
  }


  override async login(email: string, password: string): Promise<any> {
    const user = await this.authRepository.findOne({email})
    if(!user){
      throw throwlhos.err_unauthorized('Email ou senha estão incorretos', {
        email,
        password,
      })
    }
    return Promise.resolve('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjExNTkyNzgsImV4cCI6MTgyMTYzOTI3OH0.j8Rtk9lFv4TEykmAH3YKr9CPylJ_T1n0iwhB_UR_PrE')
  }
}
