import { ApiEnvironment } from './environments/ApiEnvironment.ts'

async function server() {
    const api = new ApiEnvironment()
    api.run()
}

await server()
