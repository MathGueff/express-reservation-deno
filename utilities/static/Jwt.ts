import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { Env } from '../../config/Env.ts';

export class Jwt{
    static signToken(userId: string) {
        return jwt.sign({id : userId}, Env.jwtSecret, {expiresIn : Env.authAccessTokenExpiration});
    }
    
    static verifyTokenAndDecode(token: string) {
        // const secretKey = env.jwt.secret;
       jwt.verify(token, Env.jwtSecret);
       return jwt.decode(token)
    }
}