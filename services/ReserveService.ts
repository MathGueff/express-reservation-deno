import { ClientSession} from 'mongoose'
import { ReservationRepository } from '../models/Reservation/ReservationRepository.ts'
import { UserRepository } from '../models/User/UserRepository.ts'
import { ObjectId } from '../globals/Mongo.ts'
import { throwlhos } from '../globals/Throwlhos.ts'

class ReserveService {
    private reservationRepository : ReservationRepository;
    private userRepository : UserRepository;

    constructor(){
        this.reservationRepository = new ReservationRepository();
        this.userRepository = new UserRepository();

    }

    async reserve(id : string, buyerId : string, ownerId : string, price : number, session : ClientSession){
        try {
            await this.reservationRepository.updateOne(ObjectId(id), {buyer : ObjectId(buyerId)}).session(session)
            
            await this.userRepository.updateOne(ObjectId(buyerId), {$inc : {balance : -price}}).session(session);

            await this.userRepository.updateOne(ObjectId(ownerId), {$inc : {balance : price}}).session(session);
        } catch (error) {
            throw error
        }
    }
}

export { ReserveService }