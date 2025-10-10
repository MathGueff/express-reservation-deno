import { HttpCode } from '../enums/HttpCode.ts'

export class ApiError extends Error{
    public httpCode : HttpCode;
    constructor(message : string, httpCode : HttpCode){
        super(message);

        this.httpCode = httpCode;
        this.name = 'ApiError'
        Object.setPrototypeOf(this, ApiError.prototype)
    }
}