import { BaseSchema } from '../../base/BaseSchema.ts'
import { IUser } from '../User/IUser.ts'
import bcrypt from 'bcrypt'

export class User implements IUser {
  name: IUser['name']
  email: IUser['email']
  password: IUser['password']
  balance: IUser['balance']

  constructor(user: IUser) {
    this.name = user.name
    this.email = user.email
    this.password = user.password
    this.balance = user.balance
  }

  async hashPassword(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePassword(passwordToCompare : string){
    return await bcrypt.compare(passwordToCompare, this.password)
  }
}

class UserSchemaClass extends BaseSchema {
  constructor() {
    //Mensagens de erro para required, unique, minLength e outros já são definidas no BaseSchema
    super({
      name: { 
        type: String, 
        required: true, 
        unique: true 
      },
      email: { 
        type: String, 
        required: true, 
        unique: true,  
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'O email deve ter um formato válido'] //Não definido no Base
      },
      password: { 
        type: String, 
        required: true,
        minlength : [6, 'Para uma senha segura digite no mínimo 6 caracteres']
      },
      balance : {
        type: Number,
        required : true,
        min: 0,
        default: 0
      }
    })
  }
}

const UserSchema = new UserSchemaClass().schema

//Criptografia da senha de forma automática com o middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.loadClass(User)

export { UserSchema }
