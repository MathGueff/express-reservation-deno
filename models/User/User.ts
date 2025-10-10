import { BaseSchema } from '../../base/BaseSchema.ts'
import { IUser } from '../User/IUser.ts'

export class User implements IUser {
  name : IUser['name']
  email : IUser['email']
  password : IUser['password']

  constructor(user: IUser) {
    this.name = user.name
    this.email = user.email
    this.password = user.password
  }
}

class UserSchemaClass extends BaseSchema {
  constructor() {
    super({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true }
    })
  }
}

const UserSchema = new UserSchemaClass().schema
UserSchema.loadClass(User)

export { UserSchema }
