import { NextFunction, Request, Response } from 'npm:express'
import { throwlhos } from '../../../../globals/Throwlhos.ts'
import { AuthRules } from '../AuthRules.ts'
import { AuthService } from '../AuthService.ts'

export class AuthController {
  private authService: AuthService

  private rules: AuthRules

  constructor(
    authService: AuthService = new AuthService(),
    rules = new AuthRules(),
  ) {
    this.authService = authService
    this.rules = rules
  }

  me = (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      if (!user) {
        throw throwlhos.err_unauthorized('É necessário um token válido', { user })
      }
      return res.send_ok('Informações da sua conta recuperadas com sucesso', {
        user,
      })
    } catch (error) {
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body

      this.rules.validate({ email }, { password })

      const token = await this.authService.login(email, password);
      
      return res.send_ok('Login realizado com sucesso', {
        token,
      })
    } catch (error) {
      next(error)
    }
  }
}
