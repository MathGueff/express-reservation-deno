import { IPaginationMiddle } from '../../middlewares/PaginationMiddle.ts'
import { IUser } from '../../models/User/IUser.ts'

declare global {
  namespace Express {
    interface Request {
      user: Partial<IUser>
      pagination: IPaginationMiddle.output
      userId: string
      reservationId: string
    }
  }
}
