import { MockResponser, MockNextFunction } from '../../../globals/Stubs.ts'
import { assertEquals } from 'https://deno.land/std@0.201.0/assert/mod.ts'
import { Request } from 'npm:express'
import { MockUserRepository, MockUserService } from './__mocks__/MockUserRepository.ts'
import { UserRepository } from '../../../models/User/UserRepository.ts'
import { UserController } from './UserController.ts'

const userService = new MockUserService({
    userRepository : new MockUserRepository as unknown as UserRepository
})

const userController = new UserController({
    userService
})

//GET List
Deno.test('UserController: deve mostrar todos documentos de Users', async () => {
    const mockRequest = {} as unknown as Request
    const result = await userController.findAll(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Usuários encontrados')
})

//GET by ID
Deno.test('UserController: deve mostrar um documento de Users', async () => {
     const mockRequest : Request = {
        params : {userId : '68efa598a019f17c2c22f5b1'}
    } as unknown as Request
    const result = await userController.findById(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Usuário encontrado')
})

//POST create
Deno.test('userController: deve criar um novo documento de user', async () => {
    const mockRequest : Request = {
        body : {
            name : 'Nova usuário',
            email : "inexistente@test.com",
            password : "123456",
            balance : 1
        }
    } as unknown as Request
    const result = await userController.create(mockRequest, MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Usuário criado')
})

//PUT Update
Deno.test('UserController: deve atualizar um usuário', async () => {
    const mockRequest : Request = {
        body : {
            name : 'Novo usuário',
            email : 'inexistente@test.com',
            balance : 200
        },
        params : {
            userId : '68efa598a019f17c2c22f5b1'
        }
    } as unknown as Request

    const result = await userController.update(mockRequest,MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Usuário atualizado')
})

//DELETE remove
Deno.test('UserCOntroller: deve remover um usuário', async () => {
    const mockRequest : Request = {
        params : {
            userId : '68efa67b69af3880b978bf57'
        }
    } as unknown as Request

    const result = await userController.delete(mockRequest,MockResponser, MockNextFunction) as any
    assertEquals(result.message, 'Usuário removido')
})