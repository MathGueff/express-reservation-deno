import { NextFunction, Request, Response } from 'express'
import { Print } from '../utilities/static/Print.ts'

export const printMiddle = (req : Request, res : Response, next : NextFunction) => {
    const print = new Print();

    print.info(`Executando ${req.method} ${req.path}`, {
        body : req.body,
        query : req.query
    });

    next()
}