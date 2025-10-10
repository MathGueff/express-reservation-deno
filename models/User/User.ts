import { NextFunction } from 'express'
import { BaseSchema } from '../../base/BaseSchema.ts'
import { IUser } from '../User/IUser.ts'
import bcrypt from 'bcrypt'

export class User implements IUser {
  name: IUser['name']
  email: IUser['email']
  password: IUser['password']

  constructor(user: IUser) {
    this.name = user.name
    this.email = user.email
    this.password = user.password
  }
}

class UserSchemaClass extends BaseSchema {
  constructor() {
    super({
      name: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true,  },
      password: { 
        type: String, 
        required: true
      },
    })
  }
}

const UserSchema = new UserSchemaClass().schema

UserSchema.methods.comparePassword = function(password : string){
  return bcrypt.compare(password, this.password);
}

//Criptografia da senha de forma automática com o middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.loadClass(User)

export { UserSchema }
