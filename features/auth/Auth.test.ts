import { MockNextFunction, MockResponser } from '../../globals/Stubs.ts'
import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { Request } from 'npm:express'
import { MockAuthRepository, MockAuthService } from './__mocks__/MockAuthRepository.ts'
import { AuthController } from './AuthController.ts'
import { AuthRepository } from '../../models/Auth/AuthRepository.ts'
import { defaultAssert } from '../../globals/TestAssert.ts'

const authService = new MockAuthService({
  authRepository: new MockAuthRepository() as unknown as AuthRepository,
})

const authController = new AuthController({
  authService,
})

//GET Auth
Deno.test('AuthController: deve retornar o usuário atualmente autenticado', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    userId: '68efa598a019f17c2c22f5b1',
  } as unknown as Request
  const received = await authController.me(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'success-payload', {
    message : "Informações da sua conta recuperadas com sucesso",
    code : 200, 
    status : "OK"
  })
})

Deno.test('AuthController: deve retornar erro de usuário não autenticado', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    userId: 'dfsdf',
  } as unknown as Request
  const received = await authController.me(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'error-payload', {
    message : "Nenhum usuário encontrado",
    code : 404, 
    status : "NOT_FOUND"
  })
})

//POST Login
Deno.test('AuthController: deve retornar o token do usuário com o login', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
      email: 'davy@gmail.com',
      password: 'test12',
    },
  } as unknown as Request
  const received = await authController.login(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'success-payload', {
    message : "Login realizado com sucesso",
    code : 200, 
    status : "OK"
  })
})


//POST Login
Deno.test('AuthController: deve retornar erro de email ou senha incorretos', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
      email: 'davy@ttt.com',
      password: '123345',
    },
  } as unknown as Request
  const received = await authController.login(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'error-payload', {
    message : "Email ou senha estão incorretos",
    code : 401, 
    status : "UNAUTHORIZED"
  })
})

//PATCH Change password
Deno.test('AuthController: deve alterar a senha do usuário', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
      password: 'novaSenha',
    },
    userId: '68efa598a019f17c2c22f5b1',
  } as unknown as Request
  const received = await authController.changePassword(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'success-payload', {
    message : "Senha alterada",
    code : 200, 
    status : "OK"
  })
})

//PATCH Change password
Deno.test('AuthController: deve exibir erro ao tentar alterar a senha do usuário', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    body: {
      password: 2231,
    },
    userId: '68efa598a019f17c2c22f5b1',
  } as unknown as Request
  const received = await authController.changePassword(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'error-payload', {
    message : "Campos inválidos",
    code : 422, 
    status : "BAD_REQUEST"
  })
})

