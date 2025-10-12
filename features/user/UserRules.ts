import is from '@zarco/isness'
import { BaseRules } from '../../base/BaseRules.ts'

export class UserRules extends BaseRules{
    constructor() {
        super()

        this.rc.addRule('id', {
            validator: is.string,
            message: 'O id deve ser válido'
        })

        this.rc.addRule('name', {
            validator: is.string,
            message: 'Valor para nome inválido!',
        })

        this.rc.addRule('email', {
            validator: is.string,
            message: 'Valor para email inválido!',
        })

        this.rc.addRule('password', {
            validator: is.string,
            message: 'Valor para senha inválido!',
        })
    }
}