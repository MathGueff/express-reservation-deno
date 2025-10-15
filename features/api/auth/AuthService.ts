import fn from 'npm:fn-code'
import { Env } from '../../../config/Env.ts'
import { throwlhos } from '../../../globals/Throwlhos.ts'
import { UserRepository } from '../../../models/User/UserRepository.ts'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class AuthService {
  private userRepository: UserRepository

  constructor(userRepository = new UserRepository()) {
    this.userRepository = userRepository
  }

  async login(email : string, password : string) {
    const founded = await this.userRepository.findOne({ email })

    let checked = false;

    if(founded){
      checked = await bcrypt.compare(password, founded?.password);
    }

    if (!founded || !checked) {
      throw throwlhos.err_unauthorized('Email ou senha estão incorretos', {
        email,
        password,
      })
    }

    const token = jwt.sign({ id: founded.id }, Env.jwtSecret, { expiresIn: Env.authAccessTokenExpiration })
    return token
  }
}
