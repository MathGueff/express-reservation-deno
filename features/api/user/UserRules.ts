import is from '@zarco/isness'
import { BaseRules } from '../../../base/BaseRules.ts'

export class UserRules extends BaseRules {
  constructor() {
    super()

    this.rc.addRule('id', {
      validator: is.string,
      message: 'O id deve ser válido',
    })

    this.rc.addRules('name', [
        {
            validator : is.string,
            message : 'O nome deve ser uma string'
        },
        {
            validator : (name : string) => name.length >= 3,
            message : 'O nome é muito curto, informe pelo menos 3 caracteres'
        },
    ])

    this.rc.addRules('email', [
      {
        validator: is.string,
        message: 'O email deve ter um valor válido',
      },
      {
        validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: 'Formato de email inválido',
      },
    ])

    this.rc.addRules('password', [
      {
        validator: is.string,
        message: 'A senha deve ser uma string',
      },
      {
        validator: (password: string) => password.length >= 6,
        message: 'A senha deve conter pelo menos 6 caracteres',
      },
    ])
  }
}
