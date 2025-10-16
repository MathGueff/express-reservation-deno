import { IPaginationMiddle } from '../../middlewares/PaginationMiddle.ts'
import { IRequestUser } from '../../models/User/IUser.ts'

declare global {
  namespace Express {
    interface Request {
      user : IRequestUser
      pagination : IPaginationMiddle.output
      userId : string
    }
  }
}
