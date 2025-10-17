import { UserService } from '../UserService.ts'

export class MockUserRepository {
  findMany(){
    return Promise.resolve({
        
    })
  }

  findOne(){
    return Promise.resolve({
        
    })
  }

  findById(){
    return Promise.resolve({
        
    })
  }

  create(){
    return Promise.resolve({

    })
  }

  deleteOne(){
    return Promise.resolve({

    })
  }

  updateOne(){
    return Promise.resolve({

    })
  }
  
}

export class MockUserService extends UserService {
}
