import { MockResponser, MockNextFunction } from '../../../globals/Stubs.ts'
import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { Request } from 'npm:express'
import { MockAuthRepository, MockAuthService } from './__mocks__/MockAuthRepository.ts'
import { AuthController } from './AuthController.ts'
import { AuthRepository } from '../../../models/Auth/AuthRepository.ts'

const authService = new MockAuthService({
    authRepository : new MockAuthRepository as unknown as AuthRepository
})

const authController =  new AuthController({
    authService
})

//GET Auth
Deno.test('AuthService: deve retornar o usuário atualmente autenticado', async () => {
    const mockRequest = {
        userId : '68efa598a019f17c2c22f5b1'
    } as unknown as Request
    const result = await authController.me(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Informações da sua conta recuperadas com sucesso')
})

//POST Login
Deno.test('AuthService: deve retornar o token do usuário com o login', async () => {
    const mockRequest = {
        body : {
            email : 'davy@test.com',
            password : 'test12'
        }
    } as unknown as Request
    const result = await authController.login(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Login realizado com sucesso')
})


//PATCH Change password
Deno.test('AuthService: deve alterar a senha do usuário', async () => {
    const mockRequest = {
        body : {
            password : 'novaSenha'
        },
        userId : '68efa598a019f17c2c22f5b1'
    } as unknown as Request
    const result = await authController.changePassword(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Senha alterada')
})