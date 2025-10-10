import { NextFunction, Request, Response } from 'express'
import { throwlhos } from '../globals/Throwlhos.ts'
import { UserRepository } from '../models/User/UserRepository.ts'
import { Jwt } from '../utilities/static/jwt.ts'

export const AuthMiddle = async (req : Request, _res : Response, next : NextFunction) => {
    try {
        const auth = req.headers.authorization;
    
        if(!auth){
            throw throwlhos.err_unauthorized('Acesso negado: sem autorização', {sentHeaders : req.headers})
        }
        
        const token = Jwt.verifyTokenAndDecode(auth)

        const userRepository = new UserRepository();
        const authenticated = await userRepository.findById(token.id);
        req.user = authenticated;
        return next();
    } catch (error) {
        return next(error);
    }
    
}