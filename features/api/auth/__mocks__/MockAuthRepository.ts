import { AuthService } from '../AuthService.ts'

export class MockAuthRepository{
    findById(){
        return Promise.resolve({
            
        })
    }
    findOne(){
        return Promise.resolve({
            "name": "Davy Ribeiro",
            "email": "davy@gmail.com",
            "password": "$2b$10$5CeYKJtD9E8aBPO5eTaplO2WnWTcjHFHVhkTmx5joXOMMRTw4qvCC",
        })
    }
    updateById(){
        return Promise.resolve({
            
        })
    }
}

export class MockAuthService extends AuthService{
    
}