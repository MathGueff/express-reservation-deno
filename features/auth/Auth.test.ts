import { MockNextFunction, MockResponser } from '../../globals/Stubs.ts'
import { Request } from 'npm:express'
import { MockAuthService } from './__mocks__/MockAuthRepository.ts'
import { AuthController } from './AuthController.ts'
import { defaultAssert, PayloadType } from '../../globals/TestAssert.ts'
import { ObjectId } from '../../globals/Mongo.ts'
import { ISODate } from '../../utilities/static/Time.ts'

const authService = new MockAuthService()

const authController = new AuthController({
  authService
})

//GET Auth
Deno.test('AuthController: deve retornar o usuário atualmente autenticado', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    userId: '68efa598a019f17c2c22f5b1',
  } as unknown as Request
  const received = await authController.me(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Informações da sua conta recuperadas com sucesso',
    code: 200,
    status: 'OK',
    data : {
      user : {
         _id: ObjectId('68efa598a019f17c2c22f5b1'),
        name: 'Davy Ribeiro',
        email: 'davy@gmail.com',
        password: '$2b$10$SvpOCT5YBbnVXL7WzrUl7uj/i/B3JrnL4y8C67eq.o2.yv8gKhUvS',
        balance: 500000,
        createdAt: ISODate('2025-10-15T13:46:00.178Z'),
        updatedAt: ISODate('2025-10-17T15:52:01.489Z'),
      }
    }
  })
})

Deno.test('AuthController: deve retornar erro de usuário não autenticado', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {
    userId: 'dfsdf',
  } as unknown as Request
  const received = await authController.me(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.errorPayload, {
    message: 'Nenhum usuário encontrado',
    code: 404,
    status: 'NOT_FOUND',
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
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Login realizado com sucesso',
    code: 200,
    status: 'OK',
    data : {
      token : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjExNTkyNzgsImV4cCI6MTgyMTYzOTI3OH0.j8Rtk9lFv4TEykmAH3YKr9CPylJ_T1n0iwhB_UR_PrE"
    }
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
  defaultAssert(received, PayloadType.errorPayload, {
    message: 'Email ou senha estão incorretos',
    code: 401,
    status: 'UNAUTHORIZED',
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
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Senha alterada',
    code: 200,
    status: 'OK',
    data : {
      user : {
        _id: ObjectId('68efa598a019f17c2c22f5b1'),
        name: 'Davy Ribeiro',
        email: 'davy@gmail.com',
        password: '$2b$10$SvpOCT5YBbnVXL7WzrUl7uj/i/B3JrnL4y8C67eq.o2.yv8gKhUvS',
        balance: 500000,
        createdAt: ISODate('2025-10-15T13:46:00.178Z'),
        updatedAt: ISODate('2025-10-17T15:52:01.489Z'),
      }
    }
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
  defaultAssert(received, PayloadType.errorPayload, {
    message: 'Campos inválidos',
    code: 422,
    status: 'BAD_REQUEST',
  })
})
