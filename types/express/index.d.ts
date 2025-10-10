import { IRequestUser } from '../../models/User/IUser.ts'
import { IExpress } from '../../globals/Express.ts'
import { IPaginationMiddle } from '../../middlewares/PaginationMiddle.ts'

declare global {
  namespace Express {
    interface Request {
      user: IRequestUser
      masterDomain: string
      refreshTokenId: string
      main?: boolean
      deviceInfo: IExpress.DeviceInfo

      // identifers
      userId?: string

      loggedWith: string
      pagination?: IPaginationMiddle.output
    }
  }
}
