import mongoose from 'mongoose'
import is from 'jsr:@zarco/isness'
import { throwlhos } from './Throwlhos.ts'

export type oid = mongoose.Types.ObjectId

export const ObjectId = (objectId: string | mongoose.Types.ObjectId) => {
  if (is.objectId(objectId)) {
    return new mongoose.Types.ObjectId(objectId)
  }

  throw throwlhos.err_unprocessableEntity('ObjectId inválido', { objectId })
}

export const StartTransaction = async (
  MongoDBConnection: mongoose.Connection,
) => {
  const session = await MongoDBConnection.startSession()
  await session.startTransaction()
  return session
}
