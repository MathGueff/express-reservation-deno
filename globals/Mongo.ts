import mongoose from 'mongoose'
import is from 'jsr:@zarco/isness'
import { throwlhos } from './Throwlhos.ts'

export type oid = mongoose.Types.ObjectId

export const ObjectId = (objectId: string | mongoose.Types.ObjectId) => {
  if (is.objectId(objectId)) {
    return new mongoose.Types.ObjectId(objectId)
  }

  throw throwlhos.err_unprocessableEntity('Invalid ObjectId', { objectId })
}

export const PossibleObjectId = (objectId?: string | mongoose.Types.ObjectId) => {
  if (!objectId) return null
  if (!is.objectId(objectId)) return null
  return new mongoose.Types.ObjectId(objectId)
}

export const StartTransaction = async (
  MongoDBConnection: mongoose.Connection,
) => {
  const session = await MongoDBConnection.startSession()
  await session.startTransaction()
  return session
}

export const convertFilterQueryToExpression = (query: Record<string, any>) => {
  const expressions = []

  for (const [field, condition] of Object.entries(query)) {
    if (
      typeof condition === 'object' &&
      condition !== null &&
      !Array.isArray(condition)
    ) {
      for (const [op, val] of Object.entries(condition)) {
        switch (op) {
          case '$exists':
            break
          case '$ne':
            expressions.push({ $ne: [`$${field}`, val] })
            break
          case '$size':
            expressions.push({ $eq: [{ $size: `$${field}` }, val] })
            break
          case '$not':
            if (val && typeof val === 'object' && '$size' in val) {
              expressions.push({
                $gt: [{ $size: { $ifNull: [`$${field}`, []] } }, 0],
              })
            }
            break
          default:
            throw new Error(`Unsupported operator: ${op}`)
        }
      }
    } else {
      expressions.push({ $eq: [`$${field}`, condition] })
    }
  }
  return { $and: expressions }
}
