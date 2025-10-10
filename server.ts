import { ApiEnvironment } from './environments/ApiEnvironment.ts'
import { Print } from './utilities/static/Print.ts'
const print = new Print()

async function server() {
    const api = new ApiEnvironment()
    api.run()
}

await server()
