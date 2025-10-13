import { ClientSession} from 'mongoose'
import { ReservationRepository } from '../models/Reservation/ReservationRepository.ts'
import { UserRepository } from '../models/User/UserRepository.ts'
import { ObjectId } from '../globals/Mongo.ts'
import { Print } from '../utilities/static/Print.ts'
import { printMiddle } from '../middlewares/PrintMiddle.ts'

class ReserveService {
    private reservationRepository : ReservationRepository;
    private userRepository : UserRepository;

    constructor(){
        this.reservationRepository = new ReservationRepository();
        this.userRepository = new UserRepository();

    }

    async reserve(id : string, buyerId : string, ownerId : string, price : number, session : ClientSession){
        const print = new Print();
        try {

            print.info('Atualizando reserva...')
            await this.reservationRepository.updateOne(ObjectId(id), {buyer : ObjectId(buyerId)}).session(session)
            print.info('-> Ok')

            print.info('Pagando a reserva...')
            await this.userRepository.updateOne(ObjectId(buyerId), {$inc : {balance : -price}}).session(session);
            print.info('-> Ok')

            print.info('Depositando para o dono...')
            await this.userRepository.updateOne(ObjectId(ownerId), {$inc : {balance : price}}).session(session);
            print.info('-> Ok')

            print.info('Todas as operações foram concluídas com sucesso')
        } catch (error) {
            print.error('-> Ocorreu um erro... Transação interrompida!')
            throw error
        }
    }
}

export { ReserveService }