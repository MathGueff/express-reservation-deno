import { NextFunction, Request, Response } from 'npm:express'
import { AuthRules } from './AuthRules.ts'
import { AuthService } from './AuthService.ts'

export class AuthController {
  private authService: AuthService

  private rules: AuthRules

  constructor({
    authService = new AuthService(),
    rules = new AuthRules(),
  } = {}) {
    this.authService = authService
    this.rules = rules
  }

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.userId
      const user = await this.authService.me(id)

      return res.send_ok('Informações da sua conta recuperadas com sucesso', {
        user,
      })
    } catch (error) {
      next(error)
      return error
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body

      this.rules.validate({ email }, { password })

      const token = await this.authService.login(email, password)

      return res.send_ok('Login realizado com sucesso', {
        token,
      })
    } catch (error) {
      next(error)
      return error
    }
  }

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.userId
      const password = req.body.password

      this.rules.validate({ id }, { password })

      const updated = await this.authService.changePassword(id, password)

      return res.send_ok('Senha alterada', { user: updated })
    } catch (error) {
      next(error)
      return error
    }
  }
}
