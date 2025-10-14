import is from '@zarco/isness'
import { BaseRules } from '../../../base/BaseRules.ts'

export class ReservationRules extends BaseRules{
    constructor() {
        super()

        this.rc.addRule('id', {
            validator: is.objectId,
            message: 'O id deve ser válido'
        })

        this.rc.addRules('name', [
            {
                validator : is.string,
                message : 'O nome deve ser uma string'
            },
            {
                validator : (name : string) => name.length >= 6,
                message : 'O nome é muito curto, informe pelo menos 6 caracteres'
            },
        ])


        this.rc.addRule('owner', {
            validator: is.objectId,
            message: 'Valor para owner inválido!',
        })

        this.rc.addRule('buyer', {
            validator: is.objectId,
            message: 'Valor para buyer inválido!',
        })

        this.rc.addRules('price', [
            {
                validator: is.number,
                message: 'Valor para preço inválido!',
            },
            {
                validator : (price : number) => price >= 0,
                message: 'O preço não pode ser negativo'
            }
        ])

        this.rc.addRules('daysOfDuration', [
            {
                validator: is.number,
                message: 'Valor inválido para os dias de duração',
            },
            {
                validator : (days : number) => days >= 1,
                message: 'A reserva deve ter pelo menos 1 dia de duração'
            }
        ])
    }
}