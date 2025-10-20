import { MockNextFunction, MockResponser } from '../../globals/Stubs.ts'
import { Request } from 'npm:express'
import { UserRepository } from '../../models/User/UserRepository.ts'
import { MockUserRepository } from './__mocks__/MockUserRepository.ts'
import { MockUserService } from './__mocks__/MockUserService.ts'
import { UserController } from './UserController.ts'
import { defaultAssert } from '../../globals/TestAssert.ts'

const userService = new MockUserService({
  userRepository: new MockUserRepository() as unknown as UserRepository,
})

const userController = new UserController({
  userService,
})

//GET List
Deno.test('UserController: deve mostrar todos documentos de Users em formato de Array', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {} as unknown as Request
  const received = await userController.findAll(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'success-payload', {
    message : "Usuários encontrados",
    code : 200, 
    status : "OK"
  })
})

//GET by ID
Deno.test('UserController: deve mostrar um documento de Users', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: { userId: '68efa598a019f17c2c22f5b1' },
  } as unknown as Request
  const received = await userController.findById(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'success-payload', {
    message : "Usuário encontrado",
    code : 200, 
    status : "OK"
  })
})

//GET by ID
Deno.test('UserController: deve exibir erro de usuário não encontrado', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: { userId: '68f2493a8fb51f65d37e04ac' },
  } as unknown as Request
  const received = await userController.findById(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'error-payload' ,{
    message : "Usuário não encontrado",
    code : 404, 
    status : "NOT_FOUND"
  })
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
  const received = await userController.create(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'success-payload' ,{
    message : "Usuário criado",
    code : 201, 
    status : "CREATED"
  })
})

//POST create
Deno.test(
  'UserController: deve mostrar erro ao tentar criar um novo documento de user',
  { sanitizeOps: false, sanitizeResources: false },
  async () => {
    const mockRequest: Request = {
      body: {
        name: "eeeeeeee",
        email: "e@test.com",
        password: 1,
        balance : -50
      },
    } as unknown as Request
    const received = await userController.create(mockRequest, MockResponser, MockNextFunction) as any
    defaultAssert(received, 'error-payload' ,{
      message : "Campos inválidos",
      code : 422, 
      status : "BAD_REQUEST"
    })
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

  const received = await userController.update(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'success-payload' ,{
    message : "Usuário atualizado",
    code : 200, 
    status : "OK"
  })
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

  const received = await userController.update(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'error-payload' ,{
    message : "Campos inválidos", 
    code : 422, 
    status : "BAD_REQUEST"
  })
})

//DELETE remove
Deno.test('UserCOntroller: deve remover um usuário', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      userId: '68efa563a019f17c2c22f5ad', //Usuário Matheus Gueff
    },
  } as unknown as Request

  const received = await userController.delete(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'success-payload' ,{
    message : "Usuário removido",
    code : 200, 
    status : "OK"
  })
})

//DELETE remove
Deno.test('UserController: deve exibir erro ao remover um usuário', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: {
      userId: '1234',
    },
  } as unknown as Request

  const received = await userController.delete(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, 'error-payload' ,{
    message : "ObjectId inválido", 
    code : 422, 
    status : "UNPROCESSABLE_ENTITY"
  })
})
