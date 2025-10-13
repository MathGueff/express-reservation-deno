import is from '@zarco/isness'
import { BaseRules } from '../../../base/BaseRules.ts'

export class ReservationRules extends BaseRules{
    constructor() {
        super()

        this.rc.addRule('id', {
            validator: is.string,
            message: 'O id deve ser válido'
        })

        this.rc.addRule('owner', {
            validator: is.objectId,
            message: 'Valor para owner inválido!',
        })

        this.rc.addRule('buyer', {
            validator: is.objectId,
            message: 'Valor para buyer inválido!',
        })

        this.rc.addRule('price', {
            validator: is.number,
            message: 'Valor para senha inválido!',
        })
    }
}