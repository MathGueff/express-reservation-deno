import { IBaseInterface } from '../../base/IBaseInterface.ts'

export interface IUser extends IBaseInterface {
  name: string
  email: string
  password: string

  hashPassword() : void
  comparePassword(passwordToCompare : string) : Promise<boolean>
}