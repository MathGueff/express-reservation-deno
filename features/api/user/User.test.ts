import { MockNextFunction, MockResponser } from '../../../globals/Stubs.ts'
import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { Request } from 'npm:express'
import { MockUserRepository, MockUserService } from './__mocks__/MockUserRepository.ts'
import { UserRepository } from '../../../models/User/UserRepository.ts'
import { UserController } from './UserController.ts'

const userService = new MockUserService({
  userRepository: new MockUserRepository() as unknown as UserRepository,
})

const userController = new UserController({
  userService,
})

//GET List
Deno.test('UserController: deve mostrar todos documentos de Users', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {} as unknown as Request
  const result = await userController.findAll(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Usuários encontrados')
})

//GET by ID
Deno.test('UserController: deve mostrar um documento de Users', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: { userId: '68efa598a019f17c2c22f5b1' },
  } as unknown as Request
  const result = await userController.findById(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Usuário encontrado')
})

//GET by ID
Deno.test('UserController: deve exibir erro de usuário não encontrado', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: { userId: '68f2493a8fb51f65d37e04ac' },
  } as unknown as Request
  const result = await userController.findById(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Usuário não encontrado')
})

//POST create
Deno.test('UserController: deve criar um novo documento de user', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    body: {
      name: 'Nova usuário',
      email: 'inexistente@test.com',
      password: '123456',
      balance: 1,
    },
  } as unknown as Request
  const result = await userController.create(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Usuário criado')
})

//POST create
Deno.test(
  'UserController: deve mostrar erro ao tentar criar um novo documento de user',
  { sanitizeOps: false, sanitizeResources: false },
  async () => {
    const mockRequest: Request = {
      body: {
        name: 1,
        email: 'gueff@test.com',
        password: 123,
        balance: -1,
      },
    } as unknown as Request
    const result = await userController.create(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Campos inválidos')
  },
)

//PUT Update
Deno.test('UserController: deve atualizar um usuário', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    body: {
      name: 'Novo usuário',
      email: 'inexistente@test.com',
      balance: 200,
    },
    params: {
      userId: '68efa598a019f17c2c22f5b1',
    },
  } as unknown as Request

  const result = await userController.update(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Usuário atualizado')
})

//PUT Update
Deno.test('UserController: deve retornar um erro ao tentar atualizar um usuário', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    body: {
      name: 1,
      email: 'gueff@test.com',
      balance: -200,
    },
    params: {
      userId: '1',
    },
  } as unknown as Request

  const result = await userController.update(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Campos inválidos')
})

//DELETE remove
Deno.test('UserCOntroller: deve remover um usuário', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      userId: '68efa67b69af3880b978bf57',
    },
  } as unknown as Request

  const result = await userController.delete(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'Usuário removido')
})

//DELETE remove
Deno.test('UserController: deve exibir erro ao remover um usuário', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      userId: '1234',
    },
  } as unknown as Request

  const result = await userController.delete(mockRequest, MockResponser, MockNextFunction) as any
  assertEquals(result.message, 'ObjectId inválido')
})
