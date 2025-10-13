// @deno-types='npm:@types/swagger-jsdoc'
import swaggerJsdoc from 'npm:swagger-jsdoc'
// @deno-types='npm:@types/swagger-ui-express'
import swaggerUi from 'npm:swagger-ui-express'
// @deno-types='npm:@types/express'
import { Router } from 'npm:express'
import { Print } from '../utilities/static/Print.ts'

const print = new Print()

export type ISwagger = {
  title?: string
  version?: string
  tags?: { name: string; description: string }[]
  contact?: { name: string; email: string; url: string }
  openApiVersion?: string
  customCssPath?: string
  customJsPath?: string
  routerPaths: string[]
  generateJsonFile?: boolean
  swaggerOptions?: swaggerUi.SwaggerOptions
  routerDescription?: string
}

/*****************************************************************
  Zarco says: This file should not be modified!
  (unless you need to update configurations for all swaggers)
  If you need a new swagger page, check out DocsRouter instead.
******************************************************************/

export class Swagger {
  private openApiVersion = '3.0.0'
  private title = 'API Documentation'
  private version = '1.0.0'
  private apis: string[] = []
  private customCssPath = '/custom/swagger.css'
  private customJsPath = '/custom/swagger.js'
  private swaggerDocument: object = {}
  private generateJsonFile = true
  private tags: { name: string; description: string }[] = []
  private contact: object = {}
  private routerDescription = ''
  private swaggerOptions: swaggerUi.SwaggerOptions = { explorer: true }

  constructor(swagger: ISwagger) {
    print.info('Initializing Swagger...')
    if (swagger.title) this.title = swagger.title
    if (swagger.tags) this.tags = swagger.tags
    if (swagger.version) this.version = swagger.version
    if (swagger.openApiVersion) this.openApiVersion = swagger.openApiVersion
    if (swagger.routerPaths) this.apis = swagger.routerPaths
    if (swagger.customCssPath) this.customCssPath = swagger.customCssPath
    if (swagger.customJsPath) this.customJsPath = swagger.customJsPath
    if (swagger.generateJsonFile === false) this.generateJsonFile = false
    if (swagger.swaggerOptions) this.swaggerOptions = swagger.swaggerOptions
    if (swagger.contact) this.contact = swagger.contact
    if (swagger.routerDescription) {
      this.routerDescription = swagger.routerDescription
    }
    this.generateDocument()
  }

  public generateDocument() {
    print.info('Generating Swagger Document...')
    try {
      this.swaggerDocument = swaggerJsdoc({
        definition: {
          openapi: this.openApiVersion,
          tags: this.tags,
          info: {
            title: this.title,
            version: this.version,
            contact: this.contact,
            description: this.routerDescription,
          },
        },
        apis: this.apis,
      })
      print.info('Swagger document generated successfully.')
    } catch (error) {
      print.info('Failed to generate document:', error)
      this.swaggerDocument = {}
    }

    const fileName = `${this.title.replace(/\s+/g, '_')}_${this.version}`

    if (this.generateJsonFile) {
      print.info(`Generating Swagger JSON file: ${fileName}.swagger.json`)
      try {
        Deno.writeTextFileSync(
          `./docs/jsons/${fileName}.swagger.json`,
          JSON.stringify(this.swaggerDocument, null, 2),
        )
      } catch (error) {
        print.info('Failed to write JSON file:', error)
      }
    }

    return this.swaggerDocument
  }

  public setupAndServe() {
    print.info('Setting up and serving Swagger UI...')

    const router = Router()

    try {
      // Servir arquivos estáticos do Swagger UI
      router.use(swaggerUi.serve)

      // Configurar a página inicial do Swagger UI
      router.get(
        '/',
        swaggerUi.setup(this.swaggerDocument, {
          explorer: true,
          customCssUrl: this.customCssPath,
          customJs: this.customJsPath,
          swaggerOptions: this.swaggerOptions,
        }),
      )

      print.info('Swagger UI setup completed.')
    } catch (error) {
      print.info('Error setting up Swagger UI:', error)
    }

    return router
  }
}
