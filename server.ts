import { ApiEnvironment } from './environments/ApiEnvironment.ts'

function server() {
  const api = new ApiEnvironment()
  api.run()
}

await server()
