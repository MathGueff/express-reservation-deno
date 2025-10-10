import mongoose, { Schema, SchemaDefinition, SchemaOptions, Types } from 'mongoose'
import { Time } from '../utilities/static/Time.ts'

import aggregatePaginate from 'npm:mongoose-aggregate-paginate-v2'
import is from 'jsr:@zarco/isness'

export const required = (message: string) => [true, message] as [boolean, string]

export interface CustomSchemaOptions {
  docExpiresIn?: string
  createdAtOnly?: true
}

// Função Zarco de Schema Definiton Meta

export const $def: {
  /**
   * @param message - Message to be used in the validation
   * @returns { [boolean, (this: { path: string }) => string] }
   */
  required: (message?: string) => [boolean, string]
  validate: {
    /**
     * @param values - Array of values or object with values
     * @returns { validator: (value: T) => boolean; message: (this: { path: string }) => string }
     */
    enum: <T>(values: T[] | Record<string, T>) => {
      validator: (value: T) => boolean
      message: (this: { path: string }) => string
    }
    objectId: (value: string | Types.ObjectId) => {
      validator: (value: string) => boolean
      message: (this: { path: string }) => string
    }
    string: (value: string) => {
      validator: (value: string) => boolean
      message: (this: { path: string }) => string
    }
    number: (value: number) => {
      validator: (value: string) => boolean
      message: (this: { path: string }) => string
    }
    boolean: (value: boolean) => {
      validator: (value: boolean) => boolean
      message: (this: { path: string }) => string
    }
  }
  enumOrNull: <T>(enumRecord: Record<string, T>) => (T | null)[]
} = {
  required: (message?: string) => [true, message || 'O campo `{PATH}` é obrigatório.'],

  validate: {
    enum: function validateEnum<T>(values: T[] | Record<string, T>) {
      const valueArray: T[] = Array.isArray(values) ? values : Object.values(values)
      return {
        validator: (value: T) => valueArray.includes(value),
        message(this: { path: string }) {
          const path = this.path
          return `Invalid ${path} value`
        },
      }
    },

    objectId: function validateObjectId(_value: string | Types.ObjectId) {
      return {
        validator: (value: string) => {
          return mongoose.isValidObjectId(value) && value.length === 24
        },
        message(this: { path: string }) {
          const path = this.path
          return `${path} is not a valid ObjectId`
        },
      }
    },

    string: function validateString(_value: string) {
      return {
        validator: (value: string) => is.string(value),
        message(this: { path: string }) {
          const path = this.path
          return `Invalid ${path} value`
        },
      }
    },

    number: function validateNumber(_value: number) {
      return {
        validator: (value: string) => is.number(value),
        message(this: { path: string }) {
          const path = this.path
          return `Invalid ${path} value`
        },
      }
    },

    boolean: function validateBoolean(_value: boolean) {
      return {
        validator: (value: boolean) => is.boolean(value),
        message(this: { path: string }) {
          const path = this.path
          return `Invalid ${path} value`
        },
      }
    },
  },

  enumOrNull: function enumOrNull<T>(enumRecord: Record<string, T>) {
    const values = Object.values(enumRecord)
    return [...values, null] as (T | null)[]
  },
}

export abstract class BaseSchema {
  schema: Schema
  constructor(
    schema: SchemaDefinition,
    options: CustomSchemaOptions & SchemaOptions = {},
  ) {
    const schemaOptions: SchemaOptions = {
      timestamps: true,
    }

    if (options.createdAtOnly) {
      schemaOptions.timestamps = {
        createdAt: true,
        updatedAt: false,
      }
    }

    Object.assign(schemaOptions, options)

    if (options.docExpiresIn) {
      Object.assign(schema, {
        createdAt: {
          type: Date,
          default: Time.now,
          expires: options.docExpiresIn,
        },
      })
    }

    this.schema = new Schema(
      schema,
      schemaOptions,
    )

    this.schema.plugin(aggregatePaginate)
  }
}
