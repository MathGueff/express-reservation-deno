import { Env } from '../../../config/Env.ts'
import { throwlhos } from '../../../globals/Throwlhos.ts'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthRepository } from '../../../models/Auth/AuthRepository.ts'

export class AuthService {
  private authRepository: AuthRepository

  constructor(authRepository = new AuthRepository()) {
    this.authRepository = authRepository
  }

  async login(email: string, password: string) {
    const founded = await this.authRepository.findOne({ email })

    let checked = false

    if (founded) {
      checked = await bcrypt.compare(password, founded?.password)
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

  async changePassword(id: string, password: string) {
    const salt = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password, salt)

    const update = this.authRepository.updateById(id, { password })

    if (!update) {
      throw throwlhos.err_notFound('Nenhum usuário encontrado')
    }

    return update
  }
}
