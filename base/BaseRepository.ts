// import { aggregatePaginate } from 'npm:mongoose-aggregate-paginate-v2';
import is from 'jsr:@zarco/isness'
import {
  Aggregate,
  AggregateOptions,
  FilterQuery,
  Model,
  MongooseUpdateQueryOptions,
  PipelineStage,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose'

import { SaveOptions } from 'mongoose'
import { throwlhos } from '../globals/Throwlhos.ts'

export type Pagination<T> = {
  page: number
  limit: number
  totalPages: number
  totalDocs: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number | null
  prevPage: number | null
  data: T[]
}

export interface AggregatePaginateResult<T> {
  docs: T[]
  totalDocs: number
  limit: number
  page?: number | undefined
  totalPages: number
  nextPage?: number | null | undefined
  prevPage?: number | null | undefined
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  meta?: number | boolean | T[] | null
  [customLabel: string]: T[] | number | boolean | null | undefined
}

interface CustomLabels<T = string | undefined | boolean> {
  totalDocs?: T | undefined
  docs?: T | undefined
  limit?: T | undefined
  page?: T | undefined
  nextPage?: T | undefined
  prevPage?: T | undefined
  hasNextPage?: T | undefined
  hasPrevPage?: T | undefined
  totalPages?: T | undefined
  pagingCounter?: T | undefined
  meta?: T | undefined
}

interface PaginateOptions {
  sort?: object | string | undefined
  offset?: number | undefined
  page?: number | undefined
  limit?: number | undefined
  customLabels?: CustomLabels | undefined
  /* If pagination is set to `false`, it will return all docs without adding limit condition.(Default: `true`) */
  pagination?: boolean | undefined
  allowDiskUse?: boolean | undefined
  countQuery?: object | undefined
  useFacet?: boolean | undefined
}

type AggregatePaginateModel<DocType> = Model<DocType> & {
  aggregatePaginate?<T>(
    query?: Aggregate<T[]>,
    options?: PaginateOptions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback?: (err: unknown, result: AggregatePaginateResult<T>) => void,
  ): Promise<AggregatePaginateResult<T>>
}

export type ModelRef = { ref: string; select: string[] }

export type ModelVirtuals<IModel, IModelVirtuals> = Model<
  IModel,
  Record<string, any>,
  object,
  IModelVirtuals
>

export class BaseRepository<
  T, // TRawDocType: The base document interface
  TVirtuals = object, // TVirtuals: Interface for virtual properties
  TQueryHelpers = object, // TQueryHelpers: Interface for query helper methods
  TInstanceMethods = object, // TInstanceMethods: Interface for instance methods
> {
  model: Model<T, TQueryHelpers, TInstanceMethods, TVirtuals> & {
    aggregatePaginate: AggregatePaginateModel<T>['aggregatePaginate']
  }
  modelRefs?: ModelRef[]
  constructor(
    model: Model<T, TQueryHelpers, TInstanceMethods, TVirtuals>,
    modelRefs?: ModelRef[],
  ) {
    this.model = model as
      & Model<T, TQueryHelpers, TInstanceMethods, TVirtuals>
      & { aggregatePaginate: AggregatePaginateModel<T>['aggregatePaginate'] }
    this.modelRefs = modelRefs
  }

  create(data: T, options?: SaveOptions) {
    return this.model.create([data], options)
  }

  createOne(data: T, options?: SaveOptions) {
    return this.model.create([data], options).then((docs) => docs?.[0])
  }

  createMany(data: T[], options?: SaveOptions) {
    return this.model.create(data, options)
  }

  findById(id: string | Types.ObjectId, options?: QueryOptions) {
    if (!is.objectId(id)) {
      throw throwlhos.err_internalServerError(
        'findById requires a valid ObjectId',
        {
          givenId: id,
          typeofGivenObjectId: typeof id,
        },
      )
    }
    const findById = this.model.findById(id, options)
    this.modelRefs?.forEach((ref) => findById.populate(ref.ref, ref.select))
    return findById
  }

  findOne(query: FilterQuery<T>, options?: QueryOptions) {
    const findOne = this.model.findOne(query, options)
    this.modelRefs?.forEach((ref) => findOne.populate(ref.ref, ref.select))
    return findOne
  }

  findOneAndUpdate(query: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions) {
    return this.model.findOneAndUpdate(query, update, options)
  }

  findMany(query: FilterQuery<T>, options?: QueryOptions) {
    const findMany = this.model.find(query, options)
    this.modelRefs?.forEach((ref) => findMany.populate(ref.ref, ref.select))
    return findMany
  }

  updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions,
  ) {
    if (!is.objectId(id)) {
      throw throwlhos.err_internalServerError(
        'updateById requires a valid ObjectId',
        {
          givenId: id,
          typeofGivenObjectId: typeof id,
        },
      )
    }
    const findByIdAndUpdate = this.updateOne(
      { _id: id },
      update,
      options,
    )
    return findByIdAndUpdate
  }

  updateOne(
    updateQuery: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions,
  ) {
    const findAndUpdate = this.model.findOneAndUpdate(
      updateQuery as FilterQuery<T>,
      update,
      {
        new: true,
        runValidators: true,
        ...options,
      },
    )

    this.modelRefs?.forEach((ref) => findAndUpdate.populate(ref.ref, ref.select))

    return findAndUpdate
  }

  updateMany(
    updateQuery: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions,
  ) {
    const updateMany = this.model.updateMany(
      updateQuery as FilterQuery<T>,
      update,
      {
        new: true,
        runValidators: true,
        ...options,
      },
    )

    return updateMany
  }

  deleteById(id: string | Types.ObjectId, options?: MongooseUpdateQueryOptions) {
    const findByIdAndDelete = this.model.findByIdAndDelete(id, options)
    this.modelRefs?.forEach((ref) => findByIdAndDelete.populate(ref.ref, ref.select))
    return findByIdAndDelete
  }

  deleteOne(
    query: FilterQuery<T>,
    options?: MongooseUpdateQueryOptions,
  ) {
    const findOneAndDelete = this.model.findOneAndDelete(query, options)
    this.modelRefs?.forEach((ref) => findOneAndDelete.populate(ref.ref, ref.select))
    return findOneAndDelete
  }

  findByIdAndUpdate(
    id: Types.ObjectId,
    update: UpdateQuery<T>,
    options?: QueryOptions,
  ) {
    const findByIdAndUpdate = this.model.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      ...options,
    })
    return findByIdAndUpdate
  }

  exists(query: FilterQuery<T>) {
    return this.model.exists(query)
  }

  countDocuments(query: FilterQuery<T>) {
    return this.model.countDocuments(query)
  }

  aggregate(aggregate: PipelineStage[], options?: AggregateOptions) {
    return this.model.aggregate(aggregate, options)
  }

  paginate<D = T>(
    aggregate: PipelineStage[],
    options?: AggregateOptions & { paginate?: PaginateOptions },
  ): Promise<AggregatePaginateResult<D>> {
    const aggregateOptions = options || {}
    const modelAggregate = this.model.aggregate(aggregate, aggregateOptions)
    if (!this.model.aggregatePaginate) {
      throw new Error('Model does not have aggregatePaginate method')
    }

    return this.model.aggregatePaginate(modelAggregate, options?.paginate)
  }
}
