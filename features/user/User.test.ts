import { MockNextFunction, MockResponser } from '../../globals/Stubs.ts'
import { Request } from 'npm:express'
import { UserRepository } from '../../models/User/UserRepository.ts'
import { MockUserRepository } from './__mocks__/MockUserRepository.ts'
import { MockUserService } from './__mocks__/MockUserService.ts'
import { UserController } from './UserController.ts'
import { defaultAssert, PayloadType } from '../../globals/TestAssert.ts'
import { ISODate } from '../../utilities/static/Time.ts'

const userMockRepository = new MockUserRepository()

const userService = new MockUserService({
  userRepository: userMockRepository as unknown as UserRepository,
})

const userController = new UserController({
  userService,
})

//GET List
Deno.test('UserController: deve mostrar todos documentos de Users', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest = {} as unknown as Request
  const received = await userController.findAll(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.successPayload, {
    message : 'Usuários encontrados',
    code : 200,
    status : 'OK',
    data : {
      users : userMockRepository.getMockData()
    }
  })
})

//GET List
Deno.test(
  'UserController: deve exibir erro ao procurar por todos documentos de Users',
  { sanitizeOps: false, sanitizeResources: false },
  async () => {
    const mockRequest = {
      pagination: {
        limit: 10,
        page: 500,
      },
    } as unknown as Request
    const received = await userController.findAll(mockRequest, MockResponser, MockNextFunction) as any
    defaultAssert(received, PayloadType.errorPayload, {
      message: 'Nenhum usuário encontrado',
      code: 404,
      status: 'NOT_FOUND',
    })
  },
)

//GET by ID
Deno.test('UserController: deve mostrar um documento de Users', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: { userId: '68efa598a019f17c2c22f5b1' },
  } as unknown as Request
  const received = await userController.findById(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Usuário encontrado',
    code: 200,
    status: 'OK',
    data : {
      user : {
        name: 'Davy Ribeiro',
        email: 'davy@gmail.com',
        password: '$2b$10$SvpOCT5YBbnVXL7WzrUl7uj/i/B3JrnL4y8C67eq.o2.yv8gKhUvS',
        balance: 496798
      }
    }
  })
})

//GET by ID
Deno.test('UserController: deve exibir erro de usuário não encontrado', { sanitizeOps: false, sanitizeResources: false }, async () => {
  const mockRequest: Request = {
    params: { userId: '68f2493a8fb51f65d37e04ac' },
  } as unknown as Request
  const received = await userController.findById(mockRequest, MockResponser, MockNextFunction) as any
  defaultAssert(received, PayloadType.errorPayload, {
    message: 'Usuário não encontrado',
    code: 404,
    status: 'NOT_FOUND',
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
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Usuário criado',
    code: 201,
    status: 'CREATED',
    data : {
      user : {
        name: 'Nova usuário',
        email: 'inexistente@test.com',
        password: '123456',
        balance: 1,
      }
    }
  })
})

//POST create
Deno.test(
  'UserController: deve mostrar erro ao tentar criar um novo documento de user',
  { sanitizeOps: false, sanitizeResources: false },
  async () => {
    const mockRequest: Request = {
      body: {
        name: 'eeeeeeee',
        email: 'e@test.com',
        password: 1,
        balance: -50,
      },
    } as unknown as Request
    const received = await userController.create(mockRequest, MockResponser, MockNextFunction) as any
    defaultAssert(received, PayloadType.errorPayload, {
      message: 'Campos inválidos',
      code: 422,
      status: 'BAD_REQUEST',
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
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Usuário atualizado',
    code: 200,
    status: 'OK',
    data : {
      user : {
        name: 'Novo usuário',
        email: 'inexistente@test.com',
        password : '$2b$10$SvpOCT5YBbnVXL7WzrUl7uj/i/B3JrnL4y8C67eq.o2.yv8gKhUvS',
        balance: 200,
      }}
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
  defaultAssert(received, PayloadType.errorPayload, {
    message: 'Campos inválidos',
    code: 422,
    status: 'BAD_REQUEST',
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
  defaultAssert(received, PayloadType.successPayload, {
    message: 'Usuário removido',
    code: 200,
    status: 'OK',
    data :{ 
      user : {
        name: 'Matheus Gueff',
        email: 'gueff@gmail.com',
        password: '$2b$10$4gdsCm0u6tk0pJDAtCWdreMaM8IPVRoF73pr.ynvEbpuVaY2bm6Ou',
        balance: 3353
    }}
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
  defaultAssert(received, PayloadType.errorPayload, {
    message: 'ObjectId inválido',
    code: 422,
    status: 'UNPROCESSABLE_ENTITY',
  })
})
